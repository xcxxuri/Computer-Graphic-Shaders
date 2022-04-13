#version 330 compatibility

in vec2 vST;

uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform sampler3D Noise3;

uniform float uKa, uKd, uKs;
uniform float uShininess;
uniform bool uFlat;
flat in vec3 vNf;
in vec3 vNs;
flat in vec3 vLf;
in vec3 vLs;
flat in vec3 vEf;
in vec3 vEs;

uniform vec4 uSpecularColor;

in vec3 vMC;

in vec3 vColor;

#define SQUARE(a) a*a
//const vec3 dotColor = vec3(0.,0.,0.);
//const vec3 uSpecularColor = vec3(1.,1.,1.);


vec3
RotateNormal( float angx, float angy, vec3 n )
{
        float cx = cos( angx );
        float sx = sin( angx );
        float cy = cos( angy );
        float sy = sin( angy );

        // rotate about x:
        float yp =  n.y*cx - n.z*sx;    // y'
        n.z      =  n.y*sx + n.z*cx;    // z'
        n.y      =  yp;

        // rotate about y:
        float xp =  n.x*cy + n.z*sy;    // x'
        n.z      = -n.x*sy + n.z*cy;    // z'
        n.x      =  xp;

        return normalize( n );
}

void main( ){

    vec4 nvx = texture(Noise3,uNoiseFreq*vMC);
    float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.; // -1. to +1.
	angx *= uNoiseAmp;

    vec4 nvy = texture( Noise3, uNoiseFreq*vec3(vMC.xy,vMC.z+0.5) );
	float angy = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;
	angy *= uNoiseAmp;


    vec3 finalColor = vColor;
    vec3 Normal;
    vec3 Light;
    vec3 Eye;
    if( uFlat ){
        Normal = normalize(RotateNormal(angx,angy,vNf));
        Light = normalize(vLf);
        Eye = normalize(vEf);
    }else{
        Normal = normalize(RotateNormal(angx,angy,vNs));
        Light = normalize(vLs);
        Eye = normalize(vEs);
    }
    vec3 ambient = uKa * finalColor;
    float d = max( dot(Normal,Light), 0. );
    vec3 diffuse = uKd * d * finalColor;
    float s = 0.;
    if( dot(Normal,Light) > 0. ){
        vec3 ref = normalize( 2. * Normal * dot(Normal,Light) - Light );
        s = pow( max( dot(Eye,ref),0. ), uShininess );
    }
    vec3 specular = uKs * s * uSpecularColor.rgb;
 
    gl_FragColor = vec4( ambient.rgb + diffuse.rgb + specular.rgb, 1. );

  
}