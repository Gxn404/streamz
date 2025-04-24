import React from "react";

/**
 * Formats numbers for a video streaming website.
 * @param {number} value - The number to format.
 * @param {string} type - The type of data ("views", "likes", "subscribers", "time").
 * @param {string} locale - The locale for formatting (default: "en-US").
 * @returns {JSX.Element} - Formatted number.
 */
const NumberFormatter = ({ value, type = "views", locale = "en-US" }) => {
  if (typeof value !== "number" || isNaN(value)) return <span>Invalid Data</span>;

  let formattedValue;

  switch (type) {
    case "views":
    case "likes":
    case "subscribers":
      formattedValue = new Intl.NumberFormat(locale, {
        notation: "compact",
        compactDisplay: "short",
      }).format(value);
      return <span>{formattedValue} {type === "views" ? "views" : type}</span>;

    case "time":
      const hours = Math.floor(value / 3600);
      const minutes = Math.floor((value % 3600) / 60);
      const seconds = value % 60;
      formattedValue = [
        hours > 0 ? hours.toString().padStart(2, "0") : null,
        minutes.toString().padStart(2, "0"),
        seconds.toString().padStart(2, "0"),
      ]
        .filter(Boolean)
        .join(":");
      return <span>{formattedValue}</span>;

    default:
      formattedValue = value.toLocaleString(locale);
      return <span>{formattedValue}</span>;
  }
};
export default NumberFormatter;

{/*   tutorial   */}


/* <h2>Video Metrics</h2>
      <p>👀 Views: <NumberFormatter value={1289400} type="views" /></p>
      <p>👍 Likes: <VideoNumberFormatter value={32890} type="likes" /></p>
      <p>🎥 Duration: <VideoNumberFormatter value={3720} type="time" /></p> 
      <p>🎬 Subscribers: <VideoNumberFormatter value={2500000} type="subscribers" /></p>
      
      👀 Views: 1.3M views
    👍 Likes: 32.9K likes
    🎥 Duration: 01:02:00
    🎬 Subscribers: 2.5M subscribers

      
*/