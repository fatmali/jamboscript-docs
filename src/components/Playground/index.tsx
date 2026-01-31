import React, { useState, useCallback, useMemo } from 'react';
import Editor from 'react-simple-code-editor';
import { Highlight, themes } from 'prism-react-renderer';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './styles.module.css';
// Import the individual modules to avoid the CLI code that uses fs/path
import { tokenize } from 'jamboscript/dist/lexer';
import { parse } from 'jamboscript/dist/parser';
import { generate } from 'jamboscript/dist/generator';

// JamboScript keywords for highlighting
const JAMBO_KEYWORDS = [
  'acha', 'thabiti', 'kazi', 'rudisha', 'kama', 'la sivyo', 
  'wakati', 'rudia', 'chagua', 'hali', 'kawaida', 'vunja', 
  'endelea', 'kweli', 'sivyo', 'tupu', 'andika'
];

// Custom highlighter for JamboScript
function highlightJamboScript(code: string, theme: typeof themes.dracula) {
  // First highlight as JavaScript, then overlay JamboScript keywords
  return (
    <Highlight theme={theme} code={code} language="javascript">
      {({ tokens, getLineProps, getTokenProps }) => (
        <>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => {
                const tokenProps = getTokenProps({ token });
                // Check if this token is a JamboScript keyword
                if (JAMBO_KEYWORDS.includes(token.content)) {
                  return (
                    <span
                      key={key}
                      {...tokenProps}
                      style={{ ...tokenProps.style, color: '#c678dd', fontWeight: 'bold' }}
                    />
                  );
                }
                // Check for "la sivyo" as two separate tokens
                if (token.content === 'la' || token.content === 'sivyo') {
                  return (
                    <span
                      key={key}
                      {...tokenProps}
                      style={{ ...tokenProps.style, color: '#c678dd', fontWeight: 'bold' }}
                    />
                  );
                }
                return <span key={key} {...tokenProps} />;
              })}
            </div>
          ))}
        </>
      )}
    </Highlight>
  );
}

// Highlight JavaScript output
function highlightJavaScript(code: string, theme: typeof themes.dracula) {
  return (
    <Highlight theme={theme} code={code} language="javascript">
      {({ tokens, getLineProps, getTokenProps }) => (
        <>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </>
      )}
    </Highlight>
  );
}

// Browser-safe transpile function
function transpile(source: string): string {
  const tokens = tokenize(source);
  const ast = parse(tokens);
  const javascript = generate(ast);
  return javascript;
}

const EXAMPLES = {
  hello: `# Karibu JamboScript! 🎉
# Welcome to JamboScript!

andika("Jambo Dunia!")
andika("Hello World!")`,
  
  variables: `# Variables in JamboScript
acha jina = "Fatma"
acha umri = 25
thabiti NCHI = "Kenya"

andika("Jina: " + jina)
andika("Umri: " + umri)
andika("Nchi: " + NCHI)`,
  
  functions: `# Functions with kazi
kazi salamu(jina) {
  kama (jina == "Fatma") {
    andika("Jambo boss! 👑")
  } la sivyo {
    andika("Jambo " + jina + "!")
  }
}

salamu("Fatma")
salamu("Juma")
salamu("Amina")`,
  
  loops: `# Loops with rudia and wakati
andika("Counting with rudia:")
rudia (acha i = 1; i <= 5; i++) {
  andika("Count: " + i)
}

andika("")
andika("Odd numbers with wakati:")
acha n = 1
wakati (n <= 10) {
  kama (n % 2 == 1) {
    andika(n)
  }
  n++
}`,
  
  fizzbuzz: `# FizzBuzz in JamboScript! 🎮
kazi fizzbuzz(max) {
  rudia (acha i = 1; i <= max; i++) {
    kama (i % 15 == 0) {
      andika("FizzBuzz")
    } la sivyo kama (i % 3 == 0) {
      andika("Fizz")
    } la sivyo kama (i % 5 == 0) {
      andika("Buzz")
    } la sivyo {
      andika(i)
    }
  }
}

fizzbuzz(20)`,

  fibonacci: `# Fibonacci in JamboScript 🔢
kazi fibonacci(n) {
  kama (n <= 1) {
    rudisha n
  }
  rudisha fibonacci(n - 1) + fibonacci(n - 2)
}

andika("Fibonacci sequence:")
rudia (acha i = 0; i < 10; i++) {
  andika("fib(" + i + ") = " + fibonacci(i))
}`,

  operators: `# Swahili Operators! 🇰🇪
# ni (==), na (&&), au (||), si (!)
# chini (<), zaidi (>), mpaka (<=), angalau (>=)

acha umri = 18
acha ana_kitambulisho = kweli

# Kutumia "ni" badala ya "=="
kama (umri ni 18) {
  andika("Umri ni 18!")
}

# Kutumia "na" badala ya "&&"
kama (umri ni 18 na ana_kitambulisho) {
  andika("Unaweza kupiga kura! 🗳️")
}

# Kutumia "au" badala ya "||"
acha ni_mwanafunzi = sivyo
acha ana_kazi = kweli

kama (ni_mwanafunzi au ana_kazi) {
  andika("Una shughuli!")
}

# Kutumia "si" badala ya "!"
kama (si ni_mwanafunzi) {
  andika("Wewe si mwanafunzi")
}

# Comparison operators
acha alama = 75

kama (alama zaidi 70) {
  andika("Umefaulu vizuri! 🎉")
}

kama (alama angalau 70) {
  andika("Umepita! Angalau 70 🏆")
}

# Mchanganyiko kamili
acha umri_mwanafunzi = 16
kama (umri_mwanafunzi angalau 6 na umri_mwanafunzi mpaka 18) {
  andika("Anaweza kwenda shule! 📚")
}`,
};

export default function Playground(): JSX.Element {
  const [jamboCode, setJamboCode] = useState(EXAMPLES.hello);
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { colorMode } = useColorMode();
  
  const theme = colorMode === 'dark' ? themes.dracula : themes.github;
  
  // Transpile with error handling
  const { jsCode, transpileError } = useMemo(() => {
    try {
      return { jsCode: transpile(jamboCode), transpileError: null };
    } catch (e) {
      return { 
        jsCode: '', 
        transpileError: e instanceof Error ? e.message : String(e) 
      };
    }
  }, [jamboCode]);
  
  const runCode = useCallback(() => {
    setOutput([]);
    setError(null);
    
    if (transpileError) {
      setError(transpileError);
      return;
    }
    
    const logs: string[] = [];
    const mockConsole = {
      log: (...args: any[]) => {
        logs.push(args.map(a => 
          typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
        ).join(' '));
      }
    };
    
    try {
      const fn = new Function('console', jsCode);
      fn(mockConsole);
      setOutput(logs);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [jsCode, transpileError]);
  
  const loadExample = (key: keyof typeof EXAMPLES) => {
    setJamboCode(EXAMPLES[key]);
    setOutput([]);
    setError(null);
  };
  
  return (
    <div className={styles.playground}>
      <div className={styles.toolbar}>
        <div className={styles.examples}>
          <span>Examples:</span>
          <button onClick={() => loadExample('hello')}>Hello World</button>
          <button onClick={() => loadExample('variables')}>Variables</button>
          <button onClick={() => loadExample('functions')}>Functions</button>
          <button onClick={() => loadExample('loops')}>Loops</button>
          <button onClick={() => loadExample('fizzbuzz')}>FizzBuzz</button>
          <button onClick={() => loadExample('fibonacci')}>Fibonacci</button>
          <button onClick={() => loadExample('operators')}>Operators</button>
        </div>
        <button className={styles.runButton} onClick={runCode}>
          ▶ Run Code
        </button>
      </div>
      
      <div className={styles.editorPanels}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.dot} style={{background: 'var(--ifm-color-primary)'}}></span>
            JamboScript
          </div>
          <div className={styles.editorWrapper}>
            <Editor
              value={jamboCode}
              onValueChange={setJamboCode}
              highlight={code => highlightJamboScript(code, theme)}
              padding={16}
              className={styles.editor}
              style={{
                fontFamily: 'var(--ifm-font-family-monospace)',
                fontSize: 'var(--ifm-code-font-size)',
                backgroundColor: 'transparent',
                minHeight: '350px',
              }}
            />
          </div>
        </div>
        
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.dot} style={{background: '#f7df1e'}}></span>
            JavaScript
          </div>
          <div className={styles.codeOutput}>
            {transpileError ? (
              <span className={styles.transpileError}>⚠️ {transpileError}</span>
            ) : highlightJavaScript(jsCode, theme)}
          </div>
        </div>
      </div>
      
      <div className={styles.outputPanel}>
        <div className={styles.panelHeader}>
          <span className={styles.dot} style={{background: '#4ade80'}}></span>
          Output
        </div>
        <div className={styles.console}>
          {error ? (
            <div className={styles.error}>❌ {error}</div>
          ) : output.length > 0 ? (
            output.map((line, i) => (
              <div key={i} className={styles.logLine}>{line}</div>
            ))
          ) : (
            <div className={styles.placeholder}>
              Click "Run Code" to see output...
            </div>
          )}
        </div>
      </div>
      
      <div className={styles.tip}>
        💡 <strong>Tip:</strong> JamboScript uses Swahili keywords like{' '}
        <code>acha</code> (let), <code>kazi</code> (function), and{' '}
        <code>andika</code> (print)
      </div>
      
      <div className={styles.tip}>
        🚀 <strong>Quick Start:</strong> Try JamboScript locally without installing:{' '}
        <code>npx jamboscript run yourfile.jambo</code>
      </div>
    </div>
  );
}
