const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { Writable } = require('stream');
const mongoose = require('mongoose');

// Muted stream for hidden terminal input
const mutableStdout = new Writable({
  write: function (chunk, encoding, callback) {
    if (!this.muted) {
      process.stdout.write(chunk, encoding);
    }
    callback();
  }
});
mutableStdout.muted = false;

const rl = readline.createInterface({
  input: process.stdin,
  output: mutableStdout,
  terminal: true
});

const askHidden = (query) => {
  return new Promise((resolve) => {
    mutableStdout.muted = false;
    process.stdout.write(query);
    mutableStdout.muted = true;

    rl.question('', (answer) => {
      mutableStdout.muted = false;
      process.stdout.write('\n');
      resolve(answer.trim());
    });
  });
};

const maskUri = (uri) => {
  return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:********@');
};

const runSetup = async () => {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ Error: backend/.env file not found.');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/^MONGODB_URI=(.*)$/m);

  let detectedUser = '';
  let detectedCluster = '';
  let detectedDb = 'student_db';
  let detectedQuery = '?retryWrites=true&w=majority';

  if (match) {
    const existingUri = match[1].trim();
    try {
      const protoEnd = existingUri.indexOf('://') + 3;
      const atIdx = existingUri.indexOf('@');
      if (protoEnd !== 2 && atIdx !== -1) {
        const auth = existingUri.substring(protoEnd, atIdx);
        const colonIdx = auth.indexOf(':');
        if (colonIdx !== -1) {
          detectedUser = auth.substring(0, colonIdx);
        }

        const hostAndRest = existingUri.substring(atIdx + 1);
        const qIdx = hostAndRest.indexOf('?');
        const base = qIdx !== -1 ? hostAndRest.substring(0, qIdx) : hostAndRest;
        if (qIdx !== -1) detectedQuery = hostAndRest.substring(qIdx);

        const parts = base.split('/');
        detectedCluster = parts[0] || detectedCluster;
        detectedDb = parts[1] || 'student_db';
      }
    } catch {
      // fallback to detected defaults
    }
  }

  console.log('=============================================================');
  console.log('🔒 Secure MongoDB Atlas Password Configuration');
  console.log('=============================================================');
  if (detectedUser) {
    console.log(`👤 Database User : ${detectedUser}`);
  }
  if (detectedCluster) {
    console.log(`🌐 Cluster Host  : ${detectedCluster}`);
  }
  console.log(`📂 Database Name : ${detectedDb}`);
  console.log('─────────────────────────────────────────────────────────────');
  console.log('• Terminal input is hidden (nothing is echoed on screen).');
  console.log('• Special characters will be automatically URL-encoded.');
  console.log('• Credentials will NEVER be logged or displayed.\n');

  try {
    const promptMsg = detectedUser
      ? `👉 Enter password for "${detectedUser}" (or paste full URI): `
      : '👉 Paste your MongoDB Atlas Connection URI: ';
    const input = await askHidden(promptMsg);
    rl.close();

    if (!input) {
      console.error('❌ Error: No input entered. Aborted.');
      process.exit(1);
    }

    let finalUri = '';

    if (input.startsWith('mongodb://') || input.startsWith('mongodb+srv://')) {
      // Full URI provided
      let uri = input.trim();
      if ((uri.startsWith('"') && uri.endsWith('"')) || (uri.startsWith("'") && uri.endsWith("'"))) {
        uri = uri.slice(1, -1).trim();
      }

      const protoEnd = uri.indexOf('://') + 3;
      const atIdx = uri.indexOf('@');
      if (atIdx === -1) {
        throw new Error('Invalid connection string. Missing "@" before cluster host.');
      }

      const proto = uri.substring(0, protoEnd);
      const auth = uri.substring(protoEnd, atIdx);
      const rest = uri.substring(atIdx + 1);

      const colonIdx = auth.indexOf(':');
      if (colonIdx === -1) {
        throw new Error('Invalid credentials format in URI. Missing ":" between username and password.');
      }

      const user = auth.substring(0, colonIdx);
      const rawPass = auth.substring(colonIdx + 1);
      const cleanPass = rawPass.replace(/^<|>$/g, '');
      const encodedPass = encodeURIComponent(decodeURIComponent(cleanPass));

      let hostAndDb = rest;
      const qIdx = hostAndDb.indexOf('?');
      const basePart = qIdx !== -1 ? hostAndDb.substring(0, qIdx) : hostAndDb;
      const queryPart = qIdx !== -1 ? hostAndDb.substring(qIdx) : '?retryWrites=true&w=majority';

      const hostMatch = basePart.match(/^([^/]+)(?:\/(.*))?$/);
      const host = hostMatch ? hostMatch[1] : basePart;
      let db = hostMatch && hostMatch[2] ? hostMatch[2] : detectedDb;
      if (!db || db === 'test') db = detectedDb;

      finalUri = `${proto}${user}:${encodedPass}@${host}/${db}${queryPart}`;
    } else {
      // User entered password only - preserve existing username, cluster, and database
      if (!detectedUser || !detectedCluster) {
        throw new Error('No existing connection string found in backend/.env. Please paste the full MongoDB URI.');
      }
      const cleanPass = input.trim().replace(/^<|>$/g, '');
      const encodedPass = encodeURIComponent(decodeURIComponent(cleanPass));
      finalUri = `mongodb+srv://${detectedUser}:${encodedPass}@${detectedCluster}/${detectedDb}${detectedQuery}`;
    }

    // Save into backend/.env
    let updatedEnv = envContent;
    if (updatedEnv.match(/^MONGODB_URI=.*$/m)) {
      updatedEnv = updatedEnv.replace(/^MONGODB_URI=.*$/m, `MONGODB_URI=${finalUri}`);
    } else {
      updatedEnv += `\nMONGODB_URI=${finalUri}\n`;
    }

    fs.writeFileSync(envPath, updatedEnv, 'utf8');
    console.log(`\n💾 Saved successfully to backend/.env`);
    console.log(`📡 Configured URI: ${maskUri(finalUri)}`);
    console.log(`📂 Database: ${detectedDb}\n`);

    console.log('⏳ Testing live connection to MongoDB Atlas...');
    const startTime = Date.now();
    const conn = await mongoose.connect(finalUri, { serverSelectionTimeoutMS: 8000 });
    const latency = Date.now() - startTime;

    console.log('─────────────────────────────────────────────────────────────');
    console.log('🎉 MongoDB Atlas Connection Test: SUCCESSFUL!');
    console.log(`⏱️  Latency: ${latency}ms`);
    console.log(`🌐 Cluster Host: ${conn.connection.host}`);
    console.log(`📂 Database Connected: ${conn.connection.name}`);
    console.log('─────────────────────────────────────────────────────────────');
    console.log('\n✅ Your database is fully configured and authenticated!');
    console.log('👉 Next: Populate sample data with: npm run seed');
    console.log('👉 Start the backend with: npm run dev\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n─────────────────────────────────────────────────────────────');
    console.error('❌ Connection Test Failed:');
    console.error(error.message);

    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.error('\n💡 Why this happened:');
      console.error('   MongoDB Atlas rejected the username or password.');
      console.error('   In MongoDB Atlas -> Database Access:');
      console.error(`   1. Verify user "${detectedUser}" exists.`);
      console.error('   2. Click "Edit" -> "Edit Password" -> Set a new password.');
      console.error('   3. Re-run: npm run set:password');
    } else if (error.message.includes('queryTxt ETIMEOUT') || error.message.includes('Server selection timed out')) {
      console.error('\n💡 Hint: Connection timed out.');
      console.error('   Make sure IP address 0.0.0.0/0 is added in MongoDB Atlas -> Network Access.');
    }
    console.error('─────────────────────────────────────────────────────────────\n');
    process.exit(1);
  }
};

runSetup();
