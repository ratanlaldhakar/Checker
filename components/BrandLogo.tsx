import React from "react";

interface BrandLogoProps {
  slug: string;
  className?: string;
  size?: number;
}

export function BrandLogo({ slug, className = "w-4 h-4", size }: BrandLogoProps) {
  const normalized = (slug || "").toLowerCase().trim();
  const inlineStyle = size ? { width: size, height: size } : undefined;

  switch (normalized) {
    case "meesho":
      return (
        /* Exact Official Meesho Plum + Orange 'm' Logo */
        <img
          src="/icons/meesho.png"
          alt="Meesho"
          className={`${className} object-cover rounded-[5px] flex-shrink-0`}
          style={inlineStyle}
        />
      );

    case "swiggy":
      return (
        /* Real Official Swiggy Orange Vector Logo */
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} rounded-[5px] flex-shrink-0 overflow-hidden`}
          style={inlineStyle}
        >
          <rect width="32" height="32" rx="7" fill="#FC8019" />
          <g transform="translate(4, 4) scale(1)">
            <path
              d="M12.034 24c-.376-.411-2.075-2.584-3.95-5.513-.547-.916-.901-1.63-.833-1.814.178-.48 3.355-.743 4.333-.308.298.132.29.307.29.409 0 .44-.022 1.619-.022 1.619a.441.441 0 1 0 .883-.002l-.005-2.939c0-.255-.278-.319-.331-.329-.511-.002-1.548-.006-2.661-.006-2.457 0-3.006.101-3.423-.172-.904-.591-2.383-4.577-2.417-6.819C3.849 4.964 5.723 2.225 8.362.868A8.13 8.13 0 0 1 12.026 0c4.177 0 7.617 3.153 8.075 7.209l.001.011c.084.981-5.321 1.189-6.39.904-.164-.044-.206-.212-.206-.284L13.5 4.996a.442.442 0 0 0-.884.002l.009 3.866a.33.33 0 0 0 .268.32l3.354-.001c1.79 0 2.542.207 3.042.588.333.254.461.739.349 1.37C18.633 16.755 12.273 23.71 12.034 24z"
              fill="white"
            />
          </g>
        </svg>
      );

    case "blinkit":
      return (
        /* Real Official Blinkit Yellow & Green App Icon */
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} rounded-[5px] flex-shrink-0 overflow-hidden`}
          style={inlineStyle}
        >
          <rect width="32" height="32" rx="7" fill="#F8CB46" />
          <g transform="translate(6, 4) scale(0.0075)">
            <path
              d="M630.461 1544.23C681.09 1544.23 726.294 1556.88 766.074 1582.19C806.215 1607.13 837.678 1642.55 860.461 1688.46C882.52 1732.56 893.55 1784.43 893.55 1844.07C893.55 1901.91 882.52 1953.6 860.461 1999.15C838.401 2044.69 807.3 2080.3 767.159 2105.96C726.656 2131.99 681.09 2145 630.461 2145C593.575 2145 558.858 2137.41 526.311 2122.23C493.763 2107.05 465.918 2085.72 442.773 2058.25V2131.44H254V1355H442.773V1630.44C465.918 1602.97 493.763 1581.82 526.311 1567C558.858 1551.82 593.575 1544.23 630.461 1544.23ZM574.046 1988.3C600.807 1988.3 624.675 1982.16 645.65 1969.87C666.625 1957.58 683.079 1940.41 695.013 1918.36C706.947 1896.67 712.914 1871.91 712.914 1844.07C712.914 1816.96 706.947 1792.38 695.013 1770.33C683.079 1748.28 666.625 1731.11 645.65 1718.82C624.675 1706.53 600.807 1700.39 574.046 1700.39C548.732 1700.39 526.13 1706.53 506.24 1718.82C486.35 1730.75 470.8 1747.56 459.589 1769.25C448.378 1791.3 442.773 1816.24 442.773 1844.07C442.773 1871.91 448.378 1896.85 459.589 1918.9C470.8 1940.59 486.35 1957.58 506.24 1969.87C526.13 1982.16 548.732 1988.3 574.046 1988.3Z"
              fill="#0C831F"
            />
          </g>
        </svg>
      );

    case "amazon":
      return (
        /* Real Official Amazon 'a' & Smile Logo */
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} rounded-[5px] flex-shrink-0 overflow-hidden`}
          style={inlineStyle}
        >
          <rect width="32" height="32" rx="7" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
          <g transform="translate(4, 4) scale(0.095)">
            <path
              d="m221.503 210.324c-105.235 50.083-170.545 8.18-212.352-17.271-2.587-1.604-6.984.375-3.169 4.757 13.928 16.888 59.573 57.593 119.153 57.593 59.621 0 95.09-32.532 99.527-38.207 4.407-5.627 1.294-8.731-3.16-6.872zm29.555-16.322c-2.826-3.68-17.184-4.366-26.22-3.256-9.05 1.078-22.634 6.609-21.453 9.93.606 1.244 1.843.686 8.06.127 6.234-.622 23.698-2.826 27.337 1.931 3.656 4.79-5.57 27.608-7.255 31.288-1.628 3.68.622 4.629 3.68 2.178 3.016-2.45 8.476-8.795 12.14-17.774 3.639-9.028 5.858-21.622 3.71-24.424z"
              fill="#FF9900"
            />
            <path
              d="m150.744 108.13c0 13.141.332 24.1-6.31 35.77-5.361 9.489-13.853 15.324-23.341 15.324-12.952 0-20.495-9.868-20.495-24.432 0-28.75 25.76-33.968 50.146-33.968zm34.015 82.216c-2.23 1.992-5.456 2.135-7.97.806-11.196-9.298-13.189-13.615-19.356-22.487-18.502 18.882-31.596 24.527-55.601 24.527-28.37 0-50.478-17.506-50.478-52.565 0-27.373 14.85-46.018 35.96-55.126 18.313-8.066 43.884-9.489 63.43-11.718v-4.365c0-8.018.616-17.506-4.08-24.432-4.128-6.215-12.003-8.777-18.93-8.777-12.856 0-24.337 6.594-27.136 20.257-.57 3.037-2.799 6.026-5.835 6.168l-32.735-3.51c-2.751-.618-5.787-2.847-5.028-7.07 7.543-39.66 43.36-51.616 75.43-51.616 16.415 0 37.858 4.365 50.81 16.795 16.415 15.323 14.849 35.77 14.849 58.02v52.565c0 15.798 6.547 22.724 12.714 31.264 2.182 3.036 2.657 6.69-.095 8.966-6.879 5.74-19.119 16.415-25.855 22.393l-.095-.095"
              fill="#131921"
            />
          </g>
        </svg>
      );

    case "flipkart":
      return (
        /* Real Official Flipkart Shopping Bag 'F' Logo */
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} rounded-[5px] flex-shrink-0 overflow-hidden`}
          style={inlineStyle}
        >
          <rect width="32" height="32" rx="7" fill="#2874F0" />
          <path
            d="M8.5 10H23.5L21.5 24H10.5L8.5 10Z"
            fill="#FFE11B"
          />
          <path
            d="M13 10V7.5C13 6.1 14.3 5 16 5C17.7 5 19 6.1 19 7.5V10"
            stroke="#FFE11B"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M13.5 14H18.5M13.5 17.5H17M13.5 14V21"
            stroke="#2874F0"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "whatsapp":
      return (
        /* Real Official WhatsApp Logo */
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} rounded-[5px] flex-shrink-0 overflow-hidden`}
          style={inlineStyle}
        >
          <rect width="32" height="32" rx="7" fill="#25D366" />
          <path
            d="M16 6.5C10.8 6.5 6.5 10.8 6.5 16C6.5 17.8 7 19.5 7.9 21L6.5 25.5L11.2 24.2C12.6 25 14.3 25.5 16 25.5C21.2 25.5 25.5 21.2 25.5 16C25.5 10.8 21.2 6.5 16 6.5Z"
            fill="white"
          />
          <path
            d="M13.5 11.5C13.2 10.8 12.8 10.8 12.4 10.8C12.1 10.8 11.8 10.8 11.5 11.1C11.2 11.4 10.4 12.2 10.4 13.7C10.4 15.2 11.5 16.7 11.7 16.9C11.9 17.1 13.8 20.1 16.7 21.3C19.1 22.3 19.6 22.1 20.1 22C20.6 21.9 21.7 21.3 22 20.5C22.3 19.7 22.3 19 22.2 18.8C22.1 18.6 21.8 18.5 21.4 18.3C21 18.1 19 17.1 18.6 17C18.2 16.8 18 16.7 17.7 17.1C17.4 17.5 16.8 18.3 16.6 18.5C16.4 18.7 16.2 18.7 15.8 18.5C15.4 18.3 14.2 17.9 12.8 16.6C11.7 15.6 11 14.4 10.8 14C10.6 13.6 10.8 13.4 11 13.2C11.2 13 11.5 12.7 11.7 12.4C11.9 12.1 12 11.9 12.1 11.7C12.2 11.5 12.1 11.3 12 11.1L11.5 9.9"
            fill="#25D366"
          />
        </svg>
      );

    case "telegram":
      return (
        /* Real Official Telegram Paper Plane Logo */
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} rounded-[5px] flex-shrink-0 overflow-hidden`}
          style={inlineStyle}
        >
          <rect width="32" height="32" rx="7" fill="#2AABEE" />
          <path
            d="M8.5 15.8L21.8 10.6C22.4 10.4 23 10.8 22.8 11.5L20.5 22.3C20.3 23 19.5 23.3 18.9 22.9L15.3 20.2L13.5 22C13.2 22.3 12.7 22.1 12.6 21.6L12 17.5L19.2 13L10.3 16.8L8.5 15.8Z"
            fill="white"
          />
        </svg>
      );

    case "myntra":
      return (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} rounded-[5px] flex-shrink-0 overflow-hidden bg-white border border-slate-100 dark:border-slate-800`}
          style={inlineStyle}
        >
          <path
            d="M7 21.5L11.5 11.5L16 18L20.5 11.5L25 21.5"
            stroke="#FF3F6C"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.5 21.5L16 14.5L20.5 21.5"
            stroke="#F16521"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "ajio":
      return (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} rounded-[5px] flex-shrink-0 overflow-hidden`}
          style={inlineStyle}
        >
          <rect width="32" height="32" rx="7" fill="#2C4152" />
          <text
            x="16"
            y="21"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontWeight="900"
            fontSize="11"
            letterSpacing="1"
            fill="white"
          >
            AJIO
          </text>
        </svg>
      );

    case "oyo":
      return (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} rounded-[5px] flex-shrink-0 overflow-hidden`}
          style={inlineStyle}
        >
          <rect width="32" height="32" rx="7" fill="#EE2E24" />
          <text
            x="16"
            y="21"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontWeight="900"
            fontSize="10"
            letterSpacing="1"
            fill="white"
          >
            OYO
          </text>
        </svg>
      );

    case "bigbasket":
      return (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} rounded-[5px] flex-shrink-0 overflow-hidden`}
          style={inlineStyle}
        >
          <rect width="32" height="32" rx="7" fill="#84C225" />
          <text
            x="16"
            y="21"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontWeight="900"
            fontSize="13"
            letterSpacing="0.5"
            fill="white"
          >
            bb
          </text>
        </svg>
      );

    case "jio":
      return (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} rounded-[5px] flex-shrink-0 overflow-hidden`}
          style={inlineStyle}
        >
          <rect width="32" height="32" rx="7" fill="#0A2885" />
          <text
            x="16"
            y="21.5"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontWeight="900"
            fontSize="13"
            fill="white"
          >
            Jio
          </text>
        </svg>
      );

    case "lenskart":
      return (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} rounded-[5px] flex-shrink-0 overflow-hidden`}
          style={inlineStyle}
        >
          <rect width="32" height="32" rx="7" fill="#000042" />
          <circle cx="12" cy="16" r="4.5" stroke="white" strokeWidth="2" />
          <circle cx="20" cy="16" r="4.5" stroke="white" strokeWidth="2" />
          <path d="M16.5 16H15.5" stroke="white" strokeWidth="2" />
        </svg>
      );

    case "shein":
      return (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} rounded-[5px] flex-shrink-0 overflow-hidden`}
          style={inlineStyle}
        >
          <rect width="32" height="32" rx="7" fill="#111111" />
          <text
            x="16"
            y="20.5"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontWeight="900"
            fontSize="9"
            letterSpacing="0.5"
            fill="white"
          >
            SHEIN
          </text>
        </svg>
      );

    default:
      return (
        <div
          className={`${className} rounded-[5px] bg-indigo-600 flex items-center justify-center text-white text-[9px] font-black uppercase flex-shrink-0`}
          style={inlineStyle}
        >
          {normalized.slice(0, 2)}
        </div>
      );
  }
}
