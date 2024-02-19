import { Router } from "express";
import { scrapeAmazon } from "../controllers/search.controllers.js";

const router = Router();

router.get("/", scrapeAmazon);

export default router;
