import { Token, TokenType } from '../types/dsl';

export class Lexer {
  private input: string;
  private position: number = 0;
  private line: number = 1;
  private currentChar: string | null;

  constructor(input: string) {
    this.input = input.trim();
    this.currentChar = this.input[0];
  }

  private advance() {
    this.position++;
    this.currentChar = this.position < this.input.length ? this.input[this.position] : null;
  }

  private skipWhitespace() {
    while (this.currentChar && /\s/.test(this.currentChar) && this.currentChar !== '\n') {
      this.advance();
    }
  }

  private isDigit(char: string): boolean {
    return /[0-9]/.test(char);
  }

  private readNumber(): string {
    let result = '';
    while (this.currentChar && this.isDigit(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    return result;
  }

  private readIdentifier(): string {
    let result = '';
    // 식별자나 숫자를 모두 읽을 수 있도록 수정
    while (this.currentChar && /[a-zA-Z0-9]/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    return result;
  }

  private readString(): string {
    let result = '';
    this.advance(); // Skip opening quote
    while (this.currentChar && this.currentChar !== '"') {
      result += this.currentChar;
      this.advance();
    }
    this.advance(); // Skip closing quote
    return result;
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];
    
    while (this.currentChar !== null) {
      // Skip whitespace
      if (/\s/.test(this.currentChar) && this.currentChar !== '\n') {
        this.skipWhitespace();
        continue;
      }

      // Handle newlines
      if (this.currentChar === '\n') {
        tokens.push({ type: 'NEWLINE', value: '\n', line: this.line });
        this.line++;
        this.advance();
        continue;
      }

      // Handle identifiers, keywords, and numbers
      if (/[a-zA-Z0-9]/.test(this.currentChar)) {
        const value = this.readIdentifier();
        let type: TokenType = 'IDENTIFIER';
        
        if (value === 'screen') type = 'SCREEN';
        else if (value === 'flow') type = 'FLOW';
        
        tokens.push({ type, value, line: this.line });
        continue;
      }

      // Handle strings
      if (this.currentChar === '"') {
        const string = this.readString();
        tokens.push({ type: 'STRING', value: string, line: this.line });
        continue;
      }

      // Handle special characters
      switch (this.currentChar) {
        case '{':
          tokens.push({ type: 'BRACKET_LEFT', value: '{', line: this.line });
          break;
        case '}':
          tokens.push({ type: 'BRACKET_RIGHT', value: '}', line: this.line });
          break;
        case ':':
          tokens.push({ type: 'COLON', value: ':', line: this.line });
          break;
        case '-':
          if (this.input[this.position + 1] === '>') {
            tokens.push({ type: 'ARROW', value: '->', line: this.line });
            this.advance(); // Skip the '>'
          }
          break;
      }

      this.advance();
    }

    return tokens;
  }
}