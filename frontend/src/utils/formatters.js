/**
 * Utility functions for formatting and styling
 */

const AVATAR_COLORS = [
  { bg: '#fee2e2', text: '#991b1b' }, // red
  { bg: '#fef3c7', text: '#92400e' }, // amber
  { bg: '#dcfce7', text: '#166534' }, // green
  { bg: '#e0e7ff', text: '#3730a3' }, // indigo
  { bg: '#f3e8ff', text: '#6b21a8' }, // purple
  { bg: '#e0f2fe', text: '#075985' }, // sky
  { bg: '#ffedd5', text: '#9a3412' }, // orange
  { bg: '#fce7f3', text: '#9d174d' }  // pink
];

export const getInitials = (name = '') => {
  if (!name) return 'ST';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const getAvatarColor = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};
