import elementMock from 'test-utils/mocks/element-mock';
import componentFactory from '../../src/core/component/component-factory';
import findNodes from './node-def-selector';

export default function componentFactoryFixture() {
  let comp;
  let chartMock;
  let rendererMock;
  let rendererOutput = [];
  let mediatorMock;
  let themeMock;
  let registriesMock;
  const sandbox = sinon.sandbox.create();
  const container = elementMock();

  const fn = function func() {
    chartMock = {
      brush: () => ({
        on: () => {}
      }),
      scale: sandbox.stub(),
      dataset: sandbox.stub(),
      container: sandbox.stub(),
      formatter: sandbox.stub(),
      logger: sandbox.stub(),
      element: elementMock()
    };

    rendererMock = {
      size: rect => ({ width: rect.width || 100, height: rect.height || 100 }),
      render: (nodes) => { rendererOutput = nodes; },
      appendTo: () => {},
      measureText: ({ text }) => ({
        width: text.toString().length,
        height: 5
      }),
      textBounds: ({ text, x, y }) => ({
        x: x || 0,
        y: y || 0,
        width: text.toString().length,
        height: 5
      }),
      element: () => container
    };

    mediatorMock = {
      on: sandbox.stub()
    };

    themeMock = {
      palette: sandbox.stub(),
      style: sandbox.stub()
    };

    registriesMock = {
      renderer: sandbox.stub()
    };

    return fn;
  };

  fn.mocks = () => ({
    chart: chartMock,
    renderer: rendererMock,
    theme: themeMock,
    registries: registriesMock
  });

  fn.simulateCreate = (componentDef, settings) => {
    comp = componentFactory(componentDef, {
      settings,
      chart: chartMock,
      renderer: rendererMock,
      mediator: mediatorMock,
      theme: themeMock,
      registries: registriesMock
    });

    return comp;
  };

  fn.simulateRender = (opts) => {
    const {
      inner,
      outer
    } = opts;

    comp.beforeMount();
    comp.resize(inner, outer);
    comp.beforeRender();
    comp.render();
    comp.mounted();

    return rendererOutput;
  };

  fn.simulateUpdate = (settings) => {
    comp.set({ settings });
    comp.beforeUpdate(settings);
    comp.beforeRender();
    comp.update();
    comp.updated();

    return rendererOutput;
  };

  fn.simulateLayout = opts => comp.dockConfig.requiredSize(opts.inner, opts.outer);

  fn.getRenderOutput = () => rendererOutput;

  fn.sandbox = () => sandbox;

  fn.instance = () => comp;

  fn.findNodes = s => findNodes(s, { children: rendererOutput });

  return fn();
}
