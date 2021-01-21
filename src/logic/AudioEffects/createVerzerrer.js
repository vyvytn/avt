export default function createVerzerrer( ctx ) {
  const verzerrer = ctx.createWaveShaper();

  // from MDN example: https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode
	function makeDistortionCurve(amount) {
    var k = typeof amount === 'number' ? amount : 50,
      n_samples = 44100,
      curve = new Float32Array(n_samples),
      deg = Math.PI / 180,
      i = 0,
      x;
    for ( ; i < n_samples; ++i ) {
      x = i * 2 / n_samples - 1;
      curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
    }
    return curve;
  };

  verzerrer.curve = makeDistortionCurve( 400 );
  verzerrer.oversample = "4x";

  return verzerrer;
}
