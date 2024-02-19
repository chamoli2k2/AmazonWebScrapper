import puppeteer from "puppeteer";

const solve = async (keyword) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto(`https://www.amazon.com/s?k=${keyword}`);

    const productLinks = await page.evaluate(() => {
      const links = [];
      const productItems = document.querySelectorAll(".s-result-item");
      for (let i = 0; i < Math.min(productItems.length, 6); i++) {
        const link = productItems[i].querySelector("a");
        if (link) {
          links.push(link.href);
        }
      }
      return links;
    });

    const products = [];
    for (const link of productLinks) {
      try {
        const productPage = await browser.newPage();
        await productPage.goto(link);

        const productDetails = await productPage.evaluate(() => {
          const nameElement = document.querySelector("#productTitle");
          const descriptionElement = document.querySelector(
            "#productDescription"
          );
          const ratingElement = document.querySelector(
            ".a-size-base .a-color-base"
          );
          const reviewsElement = document.querySelector(
            "#acrCustomerReviewText"
          );
          const priceElement = document.querySelector(".a-price span");

          const name = nameElement ? nameElement.innerText.trim() : "N/A";
          const description = descriptionElement
            ? descriptionElement.innerText.trim()
            : "N/A";
          const rating = ratingElement ? ratingElement.innerText.trim() : "N/A";
          const reviews = reviewsElement
            ? reviewsElement.innerText.trim()
            : "N/A";
          const price = priceElement ? priceElement.innerText.trim() : "N/A";

          return { name, description, rating, reviews, price };
        });

        // If the product name is "N/A", skip adding it to the result
        if (productDetails.name !== "N/A") {
          const topReviews = await productPage.evaluate(() => {
            const reviewItems = document.querySelectorAll(
              ".review-text-content"
            );
            const topReviews = [];
            reviewItems.forEach((item, index) => {
              if (index < 3) {
                // Limiting to the top 10 reviews but I am sending only 3 review right now as i take alot of time to fetch those review you can set it to 10 if you wish
                topReviews.push(item.innerText.trim());
              }
            });
            return topReviews;
          });

          products.push({ ...productDetails, topReviews });
        }

        // Close the product page
        await productPage.close();
      } catch (error) {
        console.error("Error scraping product page:", error);
      }
    }

    await browser.close();
    return products.filter((product) => product.name !== "N/A"); // Filter out products with "N/A" name
  } catch (error) {
    console.error("Error navigating to Amazon search results page:", error);
    await browser.close();
    return [];
  }
};

export default solve;