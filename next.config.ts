import type { NextConfig } from 'next'
import os from 'os'

const getLocalIPs = () => {
  const interfaces = os.networkInterfaces()
  const ips: string[] = []

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      // Filter for IPv4 and skip internal loopback addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address)
      }
    }
  }
  return ips
}

const localIPs = getLocalIPs()
console.log('Allowed Dev Origins:', localIPs)

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    ...localIPs
  ],
}

export default nextConfig