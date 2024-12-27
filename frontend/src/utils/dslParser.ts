import { Token, ParsedDSL, ScreenDefinition, FlowDefinition } from '../types/dsl';

export class Parser {
  private tokens: Token[];
  private position: number = 0;
  private currentToken: Token;

  constructor(tokens: Token[]) {
    this.tokens = tokens.filter(token => token.type !== 'NEWLINE'); // Ignore newlines
    this.currentToken = this.tokens[0];
  }

  private advance() {
    this.position++;
    this.currentToken = this.position < this.tokens.length ? this.tokens[this.position] : null;
  }

  private parseScreen(): ScreenDefinition {
    // Skip 'screen' keyword
    this.advance();

    // Get screen ID
    const id = this.currentToken.value;
    this.advance();

    // Skip '{'
    this.advance();

    const screen: ScreenDefinition = { id, name: id };

    while (this.currentToken && this.currentToken.type !== 'BRACKET_RIGHT') {
      if (this.currentToken.type === 'IDENTIFIER') {
        const property = this.currentToken.value;
        this.advance(); // Skip property name
        this.advance(); // Skip colon
        const value = this.currentToken.value;
        this.advance(); // Skip value

        switch (property) {
          case 'name':
            screen.name = value;
            break;
          case 'description':
            screen.description = value;
            break;
          case 'route':
            screen.route = value;
            break;
        }
      } else {
        this.advance();
      }
    }

    return screen;
  }

  private parseFlow(): FlowDefinition[] {
    const flows: FlowDefinition[] = [];

    // Skip 'flow' keyword and '{'
    this.advance();
    this.advance();

    while (this.currentToken && this.currentToken.type !== 'BRACKET_RIGHT') {
      if (this.currentToken.type === 'IDENTIFIER') {
        const source = this.currentToken.value;
        this.advance(); // Skip source
        
        if (this.currentToken && this.currentToken.type === 'ARROW') {
          this.advance(); // Skip arrow
          const target = this.currentToken.value;
          this.advance(); // Skip target

          flows.push({ source, target });
        }
      } else {
        this.advance();
      }
    }

    return flows;
  }

  parse(): ParsedDSL {
    const result: ParsedDSL = {
      screens: [],
      flows: [],
    };

    while (this.currentToken) {
      if (this.currentToken.type === 'SCREEN') {
        result.screens.push(this.parseScreen());
      } else if (this.currentToken.type === 'FLOW') {
        result.flows.push(...this.parseFlow());
      }
      
      if (this.currentToken) {
        this.advance();
      }
    }

    console.log('Parsed result:', result); // 디버깅용 로그
    return result;
  }
}