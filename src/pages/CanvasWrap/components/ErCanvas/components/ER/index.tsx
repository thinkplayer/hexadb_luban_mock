import { Graph } from "@antv/x6";

export interface ERConstructorProps {
  graph: Graph;
  container: HTMLElement;
}

export default class ER {
  public graph: Graph;
  readonly container: HTMLElement;

  constructor({ graph, container }: ERConstructorProps) {
    this.graph = graph;
    this.container = container;
  }
}
