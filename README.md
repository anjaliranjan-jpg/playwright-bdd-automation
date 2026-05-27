# Playwright BDD Automation Framework

Enterprise-grade E2E test automation using **Playwright**, **TypeScript**, **Cucumber BDD**, and **Allure Reporting**.

**Target Application:** [AutomationExercise](https://www.automationexercise.com)

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Playwright | Browser automation & API testing |
| TypeScript (strict) | Type-safe test code |
| Cucumber.js | BDD framework (Gherkin scenarios) |
| @faker-js/faker | Dynamic test data generation |
| Allure | Test reporting with screenshots & traces |

---

## Project Structure

```
├── .github/workflows/       # GitHub Actions CI/CD
├── config/
│   └── env.ts               # Environment configuration
├── src/
│   ├── features/
│   │   ├── ui/              # UI Gherkin feature files
│   │   └── api/             # API Gherkin feature files
│   ├── steps/
│   │   ├── ui/uiSteps.ts    # UI step definitions
│   │   └── api/apiSteps.ts  # API step definitions
│   ├── pages/               # Page Object Model classes
│   │   ├── BasePage.ts
│   │   ├── HomePage.ts
│   │   ├── LoginPage.ts
│   │   ├── SignupPage.ts
│   │   ├── ProductsPage.ts
│   │   ├── ProductDetailPage.ts
│   │   ├── CartPage.ts
│   │   └── ContactUsPage.ts
│   ├── api/
│   │   └── apiClient.ts     # Typed API HTTP client
│   ├── hooks/
│   │   ├── world.ts         # Cucumber World (shared context)
│   │   └── hooks.ts         # Before/After lifecycle hooks
│   └── utils/
│       ├── types.ts         # TypeScript interfaces & types
│       ├── dataGenerator.ts # Faker-based dynamic data
│       └── logger.ts        # Structured logger
├── tsconfig.json            # Strict TS config (noImplicitAny: true)
└── cucumber.js              # Cucumber runner config
```

---

## Setup

### Prerequisites
- Node.js >= 20
- npm >= 9

### Install

```bash
npm install
npx playwright install chromium
```

---

## Running Tests

| Command | Description |
|---------|-------------|
| `npm run test:regression` | Run all tests |
| `npm run test:smoke` | Run smoke suite (UI-005, UI-016, API-001, API-007) |
| `npm run test:ui` | Run all UI tests |
| `npm run test:api` | Run all API tests |

### With headed browser (visible)
```bash
HEADLESS=false npm run test:ui
```

---

## Allure Report

```bash
npm run allure:generate   # Generate report
npm run allure:open       # Open in browser
# OR
npm run report            # Generate + open in one step
```

---

## Test Coverage

### UI Scenarios (17 total)
| ID | Scenario |
|----|----------|
| UI-001 | Home page elements and layout |
| UI-002 | Navigation accessibility |
| UI-003 | Login/Signup page layout |
| UI-004 | User registration with dynamic data |
| UI-005 🔥 | Login with valid credentials |
| UI-006 | Invalid login error handling |
| UI-007 | Logout and redirection |
| UI-008 | Products grid view |
| UI-009 | Product detail page attributes |
| UI-010 | Product search with results |
| UI-011 | Product search empty state |
| UI-012 | Brand filter navigation |
| UI-013 | Add to cart |
| UI-014 | Cart quantity verification |
| UI-015 | Contact Us form with file upload |
| UI-016 🔥 | Network interception & asset blocking |
| UI-017 | Multi-context session cookie sharing |

### API Scenarios (8 total)
| ID | Scenario |
|----|----------|
| API-001 🔥 | GET /productsList structure validation |
| API-002 | POST /productsList method rejection |
| API-003 | GET /brandsList brand validation |
| API-004 | PUT /brandsList method rejection |
| API-005 | POST /searchProduct with valid param |
| API-006 | POST /searchProduct missing param |
| API-007 🔥 | Full user lifecycle (create→update→get→delete) |
| API-008 | POST /verifyLogin invalid credentials |

🔥 = included in @smoke suite

---

## Tag Strategy

```
@smoke      → Critical paths: UI-005, UI-016, API-001, API-007
@ui         → All UI scenarios
@api        → All API scenarios
@regression → Complete test suite (all tags)
```

---

## Architecture Decisions

- **No hardcoded `any`** — `noImplicitAny: true` enforced in `tsconfig.json`
- **No `waitForTimeout`** — all sync via `expect(locator).toBeVisible()`
- **No hardcoded test data** — all generated dynamically via `@faker-js/faker`
- **User-facing locators** — `getByRole`, `getByText`, `getByPlaceholder`
- **Form-encoded API payloads** — `application/x-www-form-urlencoded` for all POST/PUT
- **Screenshot on failure** — auto-captured and embedded in Allure report
