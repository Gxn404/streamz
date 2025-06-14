/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
	  remotePatterns: [
		{ protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'i1.ytimg.com' },
      { protocol: 'https', hostname: 'i2.ytimg.com' },
      { protocol: 'https', hostname: 'i3.ytimg.com' },
      { protocol: 'https', hostname: 'i4.ytimg.com' },
      { protocol: 'https', hostname: 'i5.ytimg.com' },
      { protocol: 'https', hostname: 'i6.ytimg.com' },
      { protocol: 'https', hostname: 'i7.ytimg.com' },
      { protocol: 'https', hostname: 'i8.ytimg.com' },
      { protocol: 'https', hostname: 'i9.ytimg.com' },
      { protocol: 'https', hostname: 'yt3.ggpht.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'yt3.googleusercontent.com' }
	  ],
	},
  };
  
  export default nextConfig;  
