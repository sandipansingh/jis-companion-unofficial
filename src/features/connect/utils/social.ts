export type SocialPlatform = 'github' | 'linkedin' | 'x' | 'discord' | 'portfolio';

export const SOCIAL_DOMAINS: Record<SocialPlatform, string> = {
  github: 'github.com',
  linkedin: 'linkedin.com/in',
  x: 'x.com',
  discord: 'discord.com/users',
  portfolio: '',
};

export const extractUsername = (platform: SocialPlatform, input: string): string => {
  if (!input) return '';
  const cleanInput = input.trim();
  
  if (!cleanInput.includes('.') && !cleanInput.includes('/') && !cleanInput.includes(':')) {
    return cleanInput;
  }

  try {
    const urlString = cleanInput.startsWith('http') ? cleanInput : `https://${cleanInput}`;
    const url = new URL(urlString);
    const pathname = url.pathname.replace(/\/$/, '');
    const pathParts = pathname.split('/').filter(Boolean);

    if (platform === 'portfolio') return cleanInput;

    if (platform === 'linkedin') {
        const index = pathParts.indexOf('in');
        if (index !== -1 && index + 1 < pathParts.length) return pathParts[index + 1];
    }
    
    if (platform === 'discord') {
        const index = pathParts.indexOf('users');
        if (index !== -1 && index + 1 < pathParts.length) return pathParts[index + 1];
    }
    
    if (pathParts.length > 0) {
        return pathParts[pathParts.length - 1];
    }
    
     return cleanInput;
  } catch (e) {
    return cleanInput;
  }
};

export const getProfileUrl = (platform: SocialPlatform, username: string): string => {
  if (!username) return '';
  const cleanUsername = username.trim();
  
  if (platform === 'portfolio') {
      return cleanUsername.startsWith('http') ? cleanUsername : `https://${cleanUsername}`;
  }
  
  if (cleanUsername.startsWith('http') || (cleanUsername.includes('.') && cleanUsername.includes('/'))) {
      return cleanUsername.startsWith('http') ? cleanUsername : `https://${cleanUsername}`;
  }

  const domain = SOCIAL_DOMAINS[platform];
  
  if (platform === 'x') {
    return `https://x.com/${cleanUsername}`;
  }
  
  if (platform === 'linkedin') {
      return `https://linkedin.com/in/${cleanUsername}`;
  }
  
  if (platform === 'discord') {
      // Discord uses user IDs in URLs primarily now, or just username text
      // If it's a snowflake ID (all digits), construct user link
      if (/^\d+$/.test(cleanUsername)) {
          return `https://discord.com/users/${cleanUsername}`;
      }
      return cleanUsername; // Just return the username handle if it's text
  }
  
  return `https://${domain}/${cleanUsername}`;
};

export const formatSocialInput = (platform: SocialPlatform, text: string) => {
    return extractUsername(platform, text);
};
