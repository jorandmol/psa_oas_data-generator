# Test data generation with OpenAI

Simple module developed with JS which can generate test data from OpenAPI specifications

## Requirements

- `input` folder in which OpenAPI specifications are stored. All files present inside it must be of type `yaml`.
- `output` folder to store the results.
- `.env` file in the root of the project where the API key for openapi is set. The variable must have `OPENAI_API_KEY` as name.

## Execution

Install dependencies:

```bash
npm install
```

Run the tool and follow the instructions:

```bash
npm start
```
