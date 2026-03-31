const POSITIVE = ['love', 'great', 'awesome', 'excellent', 'good', 'amazing', 'helpful', 'perfect', 'brilliant', 'fantastic'];
const NEGATIVE = ['bad', 'terrible', 'awful', 'broken', 'hate', 'useless', 'slow', 'bug', 'error', 'crash', 'fail'];

export function scoreSentiment(text) {
  const lower = text.toLowerCase();
  const words = lower.split(/\W+/);
  let pos = 0;
  let neg = 0;
  for (const word of words) {
    if (POSITIVE.includes(word)) pos++;
    if (NEGATIVE.includes(word)) neg++;
  }
  if (pos > neg) return 'positive';
  if (neg > pos) return 'negative';
  return 'neutral';
}
