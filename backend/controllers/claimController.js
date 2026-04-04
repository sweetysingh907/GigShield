const { validationResult } = require('express-validator');
const Claim = require('../models/Claim');
const Policy = require('../models/Policy');

// @GET /api/claims
exports.getClaims = async (req, res, next) => {
  try {
    const claims = await Claim.find({ user: req.user.id }).sort({ submittedAt: -1 });
    res.json({ success: true, count: claims.length, data: claims });
  } catch (error) { next(error); }
};

// @GET /api/claims/:id
exports.getClaimById = async (req, res, next) => {
  try {
    const claim = await Claim.findOne({ _id: req.params.id, user: req.user.id });
    if (!claim) return res.status(404).json({ success: false, message: 'Claim not found' });
    res.json({ success: true, data: claim });
  } catch (error) { next(error); }
};

// @POST /api/claims
exports.submitClaim = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const policy = await Policy.findOne({ user: req.user.id, status: 'active' });
    const { claimType, platform, incidentDate, estimatedLoss, description, evidenceLink } = req.body;
    const claim = await Claim.create({
      user: req.user.id,
      policy: policy ? policy._id : null,
      claimType, platform,
      incidentDate: new Date(incidentDate),
      estimatedLoss: parseFloat(estimatedLoss),
      description,
      evidenceLink: evidenceLink || ''
    });
    res.status(201).json({ success: true, message: 'Claim submitted successfully', data: claim });
  } catch (error) { next(error); }
};