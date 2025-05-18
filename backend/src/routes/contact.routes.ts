import express from "express";
import contactController from "../controllers/contact.controller";

const router = express.Router();

// Contact form email route
router.post("/send", async (req, res) => {
  await contactController.sendContactEmail(req, res);
});

export default router;
