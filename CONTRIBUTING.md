# Contributing to CareerPilot AI

This document provides guidelines for contributing to the CareerPilot AI project.

## Getting Started

### Prerequisites

- Python 3.13+
- Node.js 22+
- PostgreSQL 16+
- Docker & Docker Compose (optional but recommended)

### Local Development Setup

#### Backend

```bash
cd Backend

# Create virtual environment
python -m venv myenv

# Activate
# Windows:
.\myenv\Scripts\Activate.ps1
# Linux/macOS:
source myenv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

## Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Write tests for new functionality
4. Ensure all tests pass
5. Format and lint your code
6. Commit with clear messages: `git commit -m "Add feature description"`
7. Push to your fork: `git push origin feature/your-feature`
8. Create a Pull Request with a clear description

## Code Standards

### Python (Backend)

- Follow PEP 8 style guide
- Use meaningful variable and function names
- Add docstrings to all functions and classes
- Type hints are encouraged
- Keep functions small and focused

Example:

```python
def get_user_by_email(email: str) -> Optional[User]:
    """
    Retrieve a user by their email address.
    
    Args:
        email: The user's email address
        
    Returns:
        User object if found, None otherwise
        
    Raises:
        ValueError: If email format is invalid
    """
    if not is_valid_email(email):
        raise ValueError(f"Invalid email format: {email}")
    
    return db.query(User).filter(User.email == email).first()
```

### TypeScript/JavaScript (Frontend)

- Follow ESLint configuration
- Use TypeScript for type safety
- Use meaningful component names
- Add JSDoc comments for complex functions
- Keep components small and reusable

Example:

```typescript
/**
 * Displays a resume analysis report
 * @param resumeId - ID of the resume to display
 * @returns The analysis report component
 */
interface AnalysisReportProps {
  resumeId: string;
  onClose?: () => void;
}

export function AnalysisReport({ resumeId, onClose }: AnalysisReportProps) {
  // Component implementation
}
```

## Testing

### Backend

```bash
# Run tests
pytest test.py

# Run with coverage
pytest test.py --cov=app

# Run specific test
pytest test.py::test_function_name
```

### Frontend

```bash
# Run linter
npm run lint

# Build for testing
npm run build
```

## Commit Message Guidelines

Use clear, descriptive commit messages:

- `feat: Add new feature description`
- `fix: Fix bug in component/module`
- `docs: Update documentation`
- `style: Format code or fix style issues`
- `refactor: Refactor code without changing functionality`
- `test: Add or update tests`
- `chore: Update dependencies or configuration`

Example: `feat: Add resume analysis API endpoint`

## Pull Request Process

1. Update documentation if changes affect API or user functionality
2. Ensure all tests pass
3. Update CHANGELOG.md with your changes
4. Link related issues: `Closes #123`
5. Provide clear description of changes
6. Request review from maintainers

### PR Title Format

- `[Backend] Description` for backend changes
- `[Frontend] Description` for frontend changes
- `[Docs] Description` for documentation changes
- `[DevOps] Description` for infrastructure changes

Example: `[Backend] Add email verification endpoint`

## Reporting Issues

When reporting bugs, include:

1. Clear description of the issue
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Environment details (OS, browser, etc.)
6. Error logs or screenshots
7. Possible solution (optional)

## Feature Requests

When requesting features:

1. Clear description of the feature
2. Use case and benefits
3. Proposed implementation (optional)
4. Mockups or examples (optional)

## Code Review

- Be respectful and constructive
- Ask questions rather than make demands
- Explain your reasoning
- Acknowledge good changes
- Suggest improvements

## Documentation

- Update README.md for setup changes
- Update DEPLOYMENT.md for deployment changes
- Add inline code comments for complex logic
- Update API documentation (docstrings)
- Add examples for new features

## Performance

- Avoid N+1 database queries
- Use database indexing for frequently queried fields
- Optimize frontend bundle size
- Use code splitting for large applications
- Consider caching strategies

## Security

- Never commit secrets or API keys
- Validate all user inputs
- Use prepared statements for SQL queries
- Implement proper authentication/authorization
- Follow OWASP guidelines
- Run security scans before committing

## Before Submitting

- [ ] Code follows project style guidelines
- [ ] All tests pass locally
- [ ] New tests added for new functionality
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] No secrets or sensitive data in code
- [ ] Changes are focused on a single feature/fix

## Questions?

Feel free to open an issue or discussion for questions about contributing.

Thank you for contributing to CareerPilot AI!
