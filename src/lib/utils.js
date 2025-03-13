// Suggested code may be subject to a license. Learn more: ~LicenseLog:2213069765.
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) { return twMerge(clsx(inputs))};

