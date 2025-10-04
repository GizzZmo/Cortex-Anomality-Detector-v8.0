# Contributing to CORTEX Anomaly Detector v8.0

Thank you for your interest in contributing to the CORTEX Anomaly Detector project! This document provides guidelines and instructions for contributing.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to:
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/Cortex-Anomality-Detector-v8.0.git
cd Cortex-Anomality-Detector-v8.0

# Add upstream remote
git remote add upstream https://github.com/GizzZmo/Cortex-Anomality-Detector-v8.0.git
```

### 2. Set Up Development Environment

See [DEVELOPMENT.md](DEVELOPMENT.md) for detailed setup instructions.

### 3. Create a Branch

```bash
# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create a feature branch
git checkout -b feature/your-feature-name
```

## Development Process

### 1. Make Your Changes

- Keep changes focused and atomic
- Write clear, self-documenting code
- Add comments for complex logic
- Update documentation if needed

### 2. Follow Coding Standards

#### JavaScript/React
- Use ES6+ features
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused

#### Python
- Follow PEP 8 style guide
- Use type hints where appropriate
- Write docstrings for functions/classes

#### General
- Use meaningful variable and function names
- Keep functions small and single-purpose
- Avoid deep nesting

### 3. Test Your Changes

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test

# AI Service
cd ai_service
pytest
```

### 4. Commit Your Changes

Use clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add new face recognition feature"
```

**Commit Message Format:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Pull Request Process

### 1. Push Your Changes

```bash
git push origin feature/your-feature-name
```

### 2. Create a Pull Request

1. Go to the repository on GitHub
2. Click "Pull Request"
3. Select your branch
4. Fill in the PR template:
   - **Title**: Clear, concise description
   - **Description**: What changes were made and why
   - **Related Issues**: Link any related issues
   - **Screenshots**: If UI changes were made

### 3. PR Review Process

- Maintainers will review your PR
- Address any feedback or requested changes
- Keep the PR updated with the main branch:

```bash
git fetch upstream
git rebase upstream/main
git push origin feature/your-feature-name --force
```

### 4. Merging

Once approved, a maintainer will merge your PR.

## Coding Standards

### React Components

```javascript
import React, { useState, useEffect } from 'react';

/**
 * MyComponent - Description of component
 * @param {Object} props - Component props
 */
export default function MyComponent({ someProp }) {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Effect logic
  }, []);

  return (
    <div className="container">
      {/* Component content */}
    </div>
  );
}
```

### API Endpoints

```javascript
/**
 * GET /api/endpoint
 * Description of what this endpoint does
 */
router.get('/endpoint', async (req, res) => {
  try {
    // Logic here
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

### Python Functions

```python
def process_image(image_data: bytes) -> dict:
    """
    Process an image and return analysis results.
    
    Args:
        image_data: Raw image bytes
        
    Returns:
        Dictionary containing analysis results
    """
    # Function logic
    return {"result": "data"}
```

## Testing Guidelines

### Frontend Tests

```javascript
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

test('renders component correctly', () => {
  render(<MyComponent />);
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```

### Backend Tests

```javascript
const request = require('supertest');
const app = require('./server');

describe('API Endpoints', () => {
  it('GET /api/endpoint should return data', async () => {
    const response = await request(app).get('/api/endpoint');
    expect(response.status).toBe(200);
  });
});
```

### Python Tests

```python
def test_image_processing():
    """Test image processing function"""
    result = process_image(test_image_data)
    assert result['status'] == 'success'
```

## What to Contribute

### Good First Issues
- Documentation improvements
- Bug fixes
- UI enhancements
- Test coverage improvements

### Feature Suggestions
- Open an issue first to discuss
- Explain the use case
- Consider backwards compatibility
- Provide implementation details if possible

### Bug Reports

When reporting bugs, include:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, browser, Docker version)
- Screenshots if applicable

## Questions?

- Open an issue for questions
- Check existing issues and PRs
- Review documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to CORTEX Anomaly Detector! 🎉
