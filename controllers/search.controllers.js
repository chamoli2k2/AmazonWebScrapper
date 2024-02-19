import solve from "../utils/search.utils.js";
// @desc Search a keyword on amazon
// @route GET /search/keyword=?
// @access public

const scrapeAmazon = async (req, res) => {
  const keyword = req.query.keyword;
  const products = await solve(keyword);
  res.json(products);
};

export { scrapeAmazon };
