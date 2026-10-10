import { formatPrice } from './formatPrice';

export const INSTAGRAM_USERNAME = 'artiya._.studio';

export const INSTAGRAM_PROFILE_URL =
  `https://www.instagram.com/${INSTAGRAM_USERNAME}/`;

export function getInterestMessage(product) {
  return [
    'Hi Artiya Studio! 🌸',
    '',
    "I'm interested in this product:",
    `Product: ${product.name}`,
    `Price: ${formatPrice(product.price)}`,
    `Category: ${product.category}`,
    `Product ID: ${product.id}`,
    '',
    'Is this product available?',
    'Please share the ordering details. Thank you! 💗',
  ].join('\n');
}

async function copyTextToClipboard(message) {
  // Modern clipboard API
  try {
    if (
      navigator.clipboard &&
      window.isSecureContext
    ) {
      await navigator.clipboard.writeText(message);
      return true;
    }
  } catch (error) {
    console.warn('Clipboard API failed:', error);
  }

  // Fallback for browsers where Clipboard API is unavailable
  const textarea = document.createElement('textarea');
  textarea.value = message;
  textarea.readOnly = true;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.top = '0';

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, message.length);

  let copied = false;

  try {
    copied = document.execCommand('copy');
  } catch (error) {
    console.warn('Fallback copy failed:', error);
  }

  textarea.remove();
  return copied;
}

export async function showInterest(product) {
  const message = getInterestMessage(product);

  // Open Instagram directly from the button click.
  window.open(
    INSTAGRAM_PROFILE_URL,
    '_blank',
    'noopener,noreferrer'
  );

  const copied = await copyTextToClipboard(message);

  return { copied, message };
}