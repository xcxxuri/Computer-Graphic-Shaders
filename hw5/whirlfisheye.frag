#version 330 compatibility
#define PI 3.1415926535897932384626433832795

uniform float uPower;
uniform float uRtheta;
uniform float uBlend;
uniform float uContrast;
uniform sampler2D TexUnitA;
uniform sampler2D TexUnitB;

in vec2 vST;

const vec4 BLACK = vec4( 0., 0., 0., 1. );

float
atan2( float y, float x )
{
        if( x == 0. )
        {
                if( y >= 0. )
                        return  PI/2.;
                else
                        return -PI/2.;
        }
        return atan(y,x);
}

void
main( )
{
	vec2 st = vST - vec2(0.5,0.5);  // put (0,0) in the middle so that the range is -0.5 to +0.5
	float r = length(st);
	float r1 = pow(float (2*r), uPower);
	

	
	float theta  = atan2( st.t, st.s );
	float theta1 = theta - uRtheta * r;
	
	st = r1 * vec2( cos(theta1),sin(theta1) );  		// now in the range -1. to +1.
	st += 1.0;                       		// change the range to 0. to +2.
	st *= 0.5; 		       			// change the range to 0. to +1.
	
	// if s or t wander outside the range [0.,1.], paint the pixel black
	if( st.s < 0 || st.t <0 ){
		gl_FragColor = BLACK;
	}
	else if( st.s > 1 || st.t > 1 ){
		gl_FragColor = BLACK;
	}
	else
	{
		//sample both textures at (s,t)
		vec4 texa = texture2D( TexUnitA, st);
		vec4 texb = texture2D( TexUnitB, st);
		//mix the two samples using uBlend
		vec4 texblend = mix( texa, texb, uBlend );
		vec3 iout = (1 - uContrast) * vec3( 0.5, 0.5, 0.5 ) + uContrast * texblend.rgb;



		gl_FragColor = vec4( iout, 1. );
	}
}