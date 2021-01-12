export default class Equalizer {
  /**
   * 10 band equalizer
   * nodes       - array of the eq nodes
   * frequencies - object with frequencies as keys and nodes as values, e.g. 250 -> nodes[3]
   * entryNode   - entry point for using the eq
   * outputNode  - output point for using the eq
   */
  constructor( ctx ) {
    const frequencies = [ 32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000 ];
    const nodes = frequencies.map( ( value, index ) => {
      const filter = ctx.createBiquadFilter();

      if ( index === 0 ) {
        filter.type = "lowshelf";
        filter.frequency.value = value;
      } else if ( index === frequencies.length - 1 ) {
        filter.type = "highshelf";
        filter.frequency.value = value;
      } else {
				const Q = ((frequencies[index+1] - frequencies[index-1])/2);
				filter.type = "peaking";
				filter.frequency.value = frequencies[index+1]-Q;
				filter.Q.value = 1/Q;
      }
			return filter;
    } );
    nodes.forEach( ( node, index, nodesArr ) => {
      // connect nodes to each other: 1st to 2nd, 2nd to 3rd, etc.
      if ( index !== 0 )
        nodesArr[index-1].connect( node );
    } );

    this.entryNode = nodes[0];
    this.outputNode = nodes[nodes.length-1];
    this.nodes = nodes;
    this.frequencies = frequencies.reduce( ( acc, cur, index ) => {
      acc[cur] = nodes[index]; // generate a { 32: node, etc. } struct
      return acc;
    }, {} )
  }
}
