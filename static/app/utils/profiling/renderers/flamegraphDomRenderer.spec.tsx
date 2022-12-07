import {vec2} from 'gl-matrix';

import {makeCanvasMock, makeFlamegraph} from 'sentry-test/profiling/utils';
import {screen} from 'sentry-test/reactTestingLibrary';

import {
  LightFlamegraphTheme,
  LightFlamegraphTheme as theme,
} from 'sentry/utils/profiling/flamegraph/flamegraphTheme';
import {FlamegraphDomRenderer} from 'sentry/utils/profiling/renderers/flamegraphDomRenderer';

import {FlamegraphCanvas} from '../flamegraphCanvas';
import {FlamegraphView} from '../flamegraphView';

const originalDpr = window.devicePixelRatio;

describe('FlamegraphDomRenderer', () => {
  beforeEach(() => {
    // We simulate regular screens unless differently specified
    window.devicePixelRatio = 1;
  });
  afterEach(() => {
    window.devicePixelRatio = originalDpr;
  });

  it('renders a node', async () => {
    const flamegraph = makeFlamegraph(
      {
        endValue: 2,
        events: [
          {type: 'O', at: 0, frame: 0},
          {type: 'C', at: 2, frame: 0},
        ],
      },
      [{name: 'f0'}]
    );

    const canvas = makeCanvasMock() as HTMLCanvasElement;

    const renderer = new FlamegraphDomRenderer(canvas, flamegraph, theme);
    const flamegraphCanvas = new FlamegraphCanvas(canvas, vec2.fromValues(0, 0));

    const flamegraphView = new FlamegraphView({
      canvas: flamegraphCanvas,
      flamegraph,
      theme: LightFlamegraphTheme,
    });

    renderer.draw(
      flamegraphView.fromConfigView(flamegraphCanvas.physicalSpace),
      new Map()
    );

    expect(await screen.findByText(/f0/)).toBeInTheDocument();
  });
});