import createVerzerrer from "./createVerzerrer";
import createHall from "./createHall";
import createTelefon from "./createTelefon";
import bitcrusher from "bitcrusher";

const serverConnection = "https://dj-api.jneidel.com";

export default class AudioEffects {
  constructor( ctx ) {
    // provide stable interface for AudioPlayer
    this.entryNode = ctx.createGain();
    this.outputNode = ctx.createGain();
    this.entryNode.connect( this.outputNode );

    // initialize effects
    const effects = {
      "Verzerrer": {
        node: createVerzerrer( ctx, 100 ),
        active: false, input: null, output: null,
      },
      "Hall": {
        node: createHall( ctx, serverConnection ),
        active: false, input: null, output: null,
      },
      "Telefon": {
        node: createTelefon( ctx, serverConnection ),
        active: false, input: null, output: null,
      },
      "Bitcrusher": {
        node: bitcrusher( ctx, { bitDepth: 4, frequency: 0.2 } ),
        active: false, input: null, output: null,
      },
    };
    this.totalActive = 0;

    // only make effects obj available after initializing all of them
    Promise.all( [ effects.Hall.node, effects.Telefon.node ] )
      .then( done => {
        effects.Hall.node = done[0];
        effects.Telefon.node = done[1];
        this.effects = effects;
      } )
  }

  isAcceptedEffect( effectName ) {
    if ( this.effects ) {
      if ( !~Object.keys( this.effects ).indexOf( effectName ) )
        throw new Error( "passed unaccepted effect name" );
    } else {
      console.log( "effects not loaded yet" )
    }
  }

  /**
   * check whether the selected effect is active
   * @returns boolean
   */
  isActive( effectName ) {
    this.isAcceptedEffect( effectName );

    if ( this.effects )
      return this.effects[effectName].active;
    else
      return false;
  }

  /**
   * toggle the effect
   * @returns boolean - isActive output after the toggle
   */
  toggle( name ) {
    this.isAcceptedEffect( name );

    if ( this.effects ) {
      if ( this.effects[name].active ) { // toggle off
        this.effects[name].input.disconnect( this.effects[name].node );
        this.effects[name].node.disconnect( this.effects[name].output );
        this.effects[name].input.connect( this.effects[name].output );

        // update input/output references
        const names = Object.keys( this.effects );
        const nodes = names.map( name => this.effects[name].node );

        if ( this.effects[name].input !== this.entryNode ) {
          const nameIndex = nodes.indexOf( this.effects[name].input )
          const effectNameToOverwrite = names[nameIndex];
          this.effects[effectNameToOverwrite].output = this.effects[name].output;
        }
        if ( this.effects[name].output !== this.outputNode ) {
          const nameIndex = nodes.indexOf( this.effects[name].output )
          const effectNameToOverwrite = names[nameIndex];
          this.effects[effectNameToOverwrite].input = this.effects[name].input;
        }

        this.effects[name].input = null;
        this.effects[name].output = null;

        this.totalActive--;
      } else { // toggle on
        if ( this.totalActive === 0 ) {
          this.entryNode.disconnect( this.outputNode );

          this.entryNode.connect( this.effects[name].node );
          this.effects[name].input = this.entryNode;

          this.effects[name].node.connect( this.outputNode );
          this.effects[name].output = this.outputNode;
        } else { // 1+ active
          // put new effect as the last in line
          const nameOfNodeConnectedToOutput = Object.keys( this.effects ).reduce( ( acc, cur ) => {
            if ( this.effects[cur].output === this.outputNode )
              acc = cur;
            return acc;
          }, null );
          this.effects[nameOfNodeConnectedToOutput].node.disconnect( this.outputNode )
          this.effects[nameOfNodeConnectedToOutput].node.connect( this.effects[name].node );
          this.effects[name].input = this.effects[nameOfNodeConnectedToOutput].node;
          this.effects[nameOfNodeConnectedToOutput].output = this.effects[name].node;

          this.effects[name].node.connect( this.outputNode );
          this.effects[name].output = this.outputNode;
        }
        this.totalActive++;
      }

      this.effects[name].active = !this.effects[name].active;
      return this.effects[name].active;
    } else
      return false;
  }
}
