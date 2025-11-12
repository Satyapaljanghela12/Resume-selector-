Table of contents

Overview

Key features

Installation

Quick start (CLI & API examples)

Configuration (rules & scoring)

How selection works (algorithm)

Example workflows

Tests

Contributing

License

Overview

Resume Selector is a flexible program that ingests candidate resumes (PDF, DOCX, or structured JSON from ATS) and ranks/shortlists them using configurable criteria (skills, experience, education, certifications, keywords, location, etc.). It’s designed to speed up the early-stage screening process and integrate into hiring pipelines.

Key features

Parse resumes (PDF/DOCX/JSON) into structured text (plug your preferred parser).

Rule-based filtering (required/forbidden keywords, minimum years of experience, location constraints).

Weighted scoring system (assign weights to skills, companies, education, certifications).

Output formats: JSON shortlist, CSV, or annotated resumes.

CLI and REST API interfaces.

Extensible: add custom scoring modules (ML model, keyword expansions, boolean logic).

Installation

Prerequisites

Node >= 18 / Python 3.10 (choose implementation)

Optional: resume parsing lib (e.g., pdfminer.six, textract, python-docx, or a cloud parser)

Install (example Node)

git clone https://github.com/<your-org>/resume-selector.git
cd resume-selector
npm install


Install (example Python)

git clone https://github.com/<your-org>/resume-selector.git
cd resume-selector
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

Quick start
CLI usage (example)
# score all resumes in ./resumes/ using config ./config/selector.json
npx resume-selector-cli --input ./resumes --config ./config/selector.json --output ./shortlist.json


Output: shortlist.json contains candidate id, name, score, matched_rules, and top matched snippets.

REST API (example)

Start server:

npm run start
# or
python -m resume_selector.api


POST /api/score (multipart/form-data or JSON body)

POST /api/score
Content-Type: multipart/form-data
file: resume.pdf
configId: default-engine


Response:

{
  "candidate": { "id": "abc123", "name": "Priya K." },
  "score": 82.5,
  "matches": [
    { "type": "skill", "value": "React", "weight": 10 },
    { "type": "experience", "value": "5 years backend", "weight": 8 }
  ],
  "passed": true
}

Configuration (rules & scoring)

A simple JSON config example:

{
  "required": ["Bachelor", "English"],
  "forbidden": ["fresher"],
  "min_experience_years": 3,
  "skill_weights": {
    "React": 10,
    "Node.js": 8,
    "TypeScript": 6,
    "Python": 7
  },
  "company_bonus": {
    "FAANG": 5
  },
  "education_weights": {
    "PhD": 8,
    "Masters": 5,
    "Bachelor": 3
  },
  "location_preference": {
    "remote": 2,
    "Mumbai": 3
  },
  "threshold_shortlist": 60,
  "max_results": 50
}


required — tokens that must appear; missing => fail filter.

forbidden — tokens that immediately disqualify.

skill_weights — positive contributions to score.

threshold_shortlist — minimum score to include in shortlist.

How selection works (algorithm)

Parsing — convert resume to structured text & extract fields (name, email, skills, experience blocks, education).

Preprocessing — normalize tokens, expand synonyms (React → reactjs), basic NER for dates and companies.

Filtering — apply required / forbidden rules and hard constraints (min experience).

Scoring — compute weighted score:

sum(skill weights × matched skill presence)

add education/company/location bonuses

penalize missing must-haves

Normalization — normalize final score to 0–100.

Shortlist — return candidates above threshold_shortlist, sorted by score.

This approach is deterministic and transparent — easy to tune.

Example workflows
Basic shortlist pipeline

Bulk upload resumes to ./resumes/.

Use selector.json tuned for the job.

Run CLI to produce shortlist.json.

Review top 10; export to ATS or invite for phone screen.

Automatic interview scheduling (advanced)

Integrate with calendar + ATS: for candidates with score ≥ 80, create interview requests with recruiter & candidate.

Tests

Unit tests for parser, filters, scoring rules.

Example commands:

npm run test
# or
pytest tests/


Include a small set of sample resumes in /tests/fixtures for CI.

Extensibility & tips

Add a synonyms dictionary for skills (e.g., js → JavaScript).

Integrate a basic ML classifier to re-rank candidates based on historical hires.

Keep required-constraints minimal to avoid over-filtering good candidates.

Log matched snippets to explain why a candidate scored highly (auditability).

Contributing

Fork repository

Create a feature branch feature/your-feature

Write tests & update README if needed

Open a PR with a clear description

See CONTRIBUTING.md for style guidelines and commit message format.

Security & privacy

Treat resume files as personal data.

If storing resumes, use encryption in transit & at rest and follow local data protection rules (e.g., GDPR).

Provide a delete workflow for candidate data.

License

MIT License — see LICENSE file.

Contact / Maintainers

Repo owner: <your-org>

Issues: use the GitHub Issues tab for feature requests and bugs.

For questions: open a discussion or email recruitment-tools@your-org.com.
