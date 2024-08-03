export const getClientId = () => {
  // get "_y" cookie
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("_y="));
  const y = cookie ? cookie.split("=")[1] : null;
  return y;
};

export const parseCurrencyValue = (formattedCurrency) => {
  // removes all non-numeric characters from string, keeps only 0-9, nothing else
  const value = formattedCurrency.replace(/[^0-9]/g, "") / 100;

  return value;
}

// return string between two strings
// if endString is not found, return string from startString to end of string
// if startString is not found, return empty string
export const getStringBetween = (string, startString, endString) => {
  const start = string.indexOf(startString);
  if (start === -1) {
    return "";
  }

  const end = string.indexOf(endString, start + startString.length);
  if (end === -1) {
    return string.substring(start + startString.length);
  }

  return string.substring(start + startString.length, end);
}

export const getProductHandleFromURL = (url) => {
  const productHandle = getStringBetween(url, "/products/", "?");
  return productHandle;
}

export function replaceCurrency(formattedCurrency, newValue) {
  let currencySymbol = formattedCurrency.match(/[^0-9,.]+/g); // Extract the currency symbol
  if (currencySymbol !== null) {
    currencySymbol = currencySymbol[0]; // If currency symbol is found, use it, otherwise use an empty string
  } else {
    currencySymbol = "";
  }
  
  const currencyCodeMatch = formattedCurrency.match(/(\s[A-Z]{3})/); // Extract the currency code, if any
  const currencyCode = currencyCodeMatch ? currencyCodeMatch[0] : ""; // If currency code is found, use it, otherwise use an empty string

  // Check if the formatted currency uses a comma as a decimal separator
  const hasCommaDecimalSeparator =
    formattedCurrency.match(/(\d+),(\d{2})($|\s)/) !== null;

  // Check if the formatted currency uses a comma as a thousand separator
  const hasCommaThousandSeparator =
    formattedCurrency.match(/(\d{1,3})(,\d{3})+/) !== null;

  // Format the new value according to the decimal and thousand separators used
  const formattedNewValue = newValue.toLocaleString(
    hasCommaDecimalSeparator ? "de-DE" : "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: hasCommaThousandSeparator,
    }
  );

  return `${currencySymbol}${formattedNewValue}${currencyCode}`;
}

export const excecuteOnMutation = (func, mutationSelectors) => {
  // use MutationObserver
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if ($(node).find(mutationSelectors).length > 0 || $(node).is(mutationSelectors)) {
          func();
        }
      });
    });
  });


  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};