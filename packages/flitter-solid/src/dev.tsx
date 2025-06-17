/* @refresh reload */
import { render } from 'solid-js/web';
import { createSignal } from 'solid-js';
import Widget from './lib/index';
import { 
  Container, 
  Text, 
  Center, 
  Column,
  GestureDetector,
  MainAxisAlignment,
  CrossAxisAlignment
} from '@meursyphus/flitter';

function App() {
  const [count, setCount] = createSignal(0);
  const [renderer, setRenderer] = createSignal<'svg' | 'canvas'>('svg');

  const createFlitterWidget = () => {
    return Center({
      child: Column({
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container({
            width: 200,
            height: 100,
            color: `hsl(${count() * 10}, 70%, 80%)`,
            child: Center({
              child: Text(`Count: ${count()}`, {
                style: { 
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: '#333'
                }
              })
            })
          }),
          GestureDetector({
            onClick: () => setCount(count() + 1),
            child: Container({
              margin: { top: 20 },
              padding: { horizontal: 20, vertical: 10 },
              color: '#4CAF50',
              borderRadius: 5,
              child: Text('Click me!', {
                style: { 
                  color: 'white',
                  fontSize: 16
                }
              })
            })
          })
        ]
      })
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Flitter SolidJS Integration Demo</h1>
      
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        'margin-bottom': '20px' 
      }}>
        <button onClick={() => setRenderer('svg')} 
                style={{ 
                  'font-weight': renderer() === 'svg' ? 'bold' : 'normal' 
                }}>
          SVG Renderer
        </button>
        <button onClick={() => setRenderer('canvas')} 
                style={{ 
                  'font-weight': renderer() === 'canvas' ? 'bold' : 'normal' 
                }}>
          Canvas Renderer
        </button>
        <button onClick={() => setCount(0)}>
          Reset Count
        </button>
      </div>

      <div style={{ 
        border: '1px solid #ccc', 
        'border-radius': '8px',
        overflow: 'hidden'
      }}>
        <Widget 
          widget={createFlitterWidget()}
          width="600px"
          height="400px"
          renderer={renderer()}
        />
      </div>

      <p style={{ 'margin-top': '20px' }}>
        Current renderer: <strong>{renderer()}</strong>
      </p>
    </div>
  );
}

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(() => <App />, root!);