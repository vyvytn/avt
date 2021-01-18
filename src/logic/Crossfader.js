export default class Crossfader {
  constructor( ctx ) {
    this.ctx = ctx;
  }


  leftOutputNode = null;
  rightOutputNode = null;
  /**
   * generate output nodes to pass to the left/right player
   */
  generateOutputNodes( sharedOutput ) {
    this.leftOutputNode = this.ctx.createGain();
    this.rightOutputNode = this.ctx.createGain();

    this.leftOutputNode.connect( sharedOutput );
    this.rightOutputNode.connect( sharedOutput );

    this.setBalance( 0.5 ); // default balance

    return [ this.leftOutputNode, this.rightOutputNode ];
  }

  /**
   * set the balance of the crossfade between the two gain nodes where:
   * 0.5 = equal volumes (50%/50%)
   *   0 = left player on full volume, right muted (100%/0%)
   *   1 = right player on full volume, left muted (0%/100%)
   * 0.8 = right player louder than left one (20%/80%) [percentage just as an example]
   */
  setBalance( value ) {
    if ( this.leftOutputNode === null )
      throw new Error( "generateOutputNodes needs to be run before setBalance" );
    if ( value > 1 || value < 0 )
      throw new Error( "invalid value passed to setBalance, value has to be between 0 and 1" );

    // equal power crossfade
    const leftGain = Math.cos(value * 0.5*Math.PI);
    const rightGain = Math.cos((1.0-value) * 0.5*Math.PI);

    this.leftOutputNode.gain.value = leftGain;
    this.rightOutputNode.gain.value = rightGain;
  }
  getBalance = () => this.balance;
}
