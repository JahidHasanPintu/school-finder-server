const express = require('express');
const router = express.Router();
const cosineSimilarity = require('compute-cosine-similarity');
const schoolsDataset = require('../allschool.json');
function extractFeatures(school) {
    return [
        school.DIVISION_NAME,
        school.DISTRICT_NAME,
        school.THANA_NAME,
        school.TYP,
        school.LVL,
        school.EIIN,
        school.INSTITUTE_NAME_NEW,
        school.POST_OFFICE,
        school.LOCATION,
        school.MOBPHONE,
    ];
}

router.post('/', (req, res) => {
    const { eiin } = req.body; 
    const targetSchool = schoolsDataset.find(school => school.EIIN === eiin);

    if (!targetSchool) {
        return res.status(404).json({ error: 'School not found' });
    }
    const similarityScores = [];
    const targetSchoolFeatures = extractFeatures(targetSchool);
    schoolsDataset.forEach(school => {
        if (school.EIIN !== eiin) {
            const currentSchoolFeatures = extractFeatures(school);
            const similarity = cosineSimilarity(targetSchoolFeatures, currentSchoolFeatures);
            similarityScores.push({ eiin: school.EIIN, similarity });
        }
    });
    similarityScores.sort((a, b) => b.similarity - a.similarity);
    const topNSimilarSchools = similarityScores.slice(0, 5);
    const recommendations = topNSimilarSchools.map(({ eiin }) => schoolsDataset.find(school => school.EIIN === eiin));
    res.json(recommendations);
});

module.exports = router;
