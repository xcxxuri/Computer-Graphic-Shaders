#version 330 compatibility

uniform float uAd;
uniform float uBd;
uniform float uTol;
in vec2 vST;

uniform float uNoiseAmp;
uniform float uNoiseFreq;

uniform float uAlpha;
uniform sampler2D Noise2;

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
uniform vec4 uDotColor;


in vec3 vColor;

#define SQUARE(a) a*a
void
main( ){
    float Ar = uAd / 2.;
    float Br = uBd / 2.;
    int numins = int ( vST.s / uAd);
    int numint = int (vST.t / uBd);

    vec4 nv  = texture( Noise2, uNoiseFreq*vST );
    float n = nv.r + nv.g + nv.b + nv.a;    //  1. -> 3.
    n = n - 2.;                             // -1. -> 1.
    n*= uNoiseAmp;

    float sc = float(numins) * uAd  +  Ar;
    float ds = vST.s - sc;                   // wrt ellipse center
    float tc = float(numint) * uBd  +  Br;
    float dt = vST.t - tc;                   // wrt ellipse center

    float oldDist = sqrt( ds*ds + dt*dt );
    float newDist = oldDist + n;
    float scale = newDist / oldDist;        // this could be < 1., = 1., or > 1.

    ds *= scale;
    ds /= Ar;
    dt *= scale;
    dt /= Br;
    float whereAmI = ds*ds + dt*dt;
    float t = smoothstep(1.-uTol, 1.+uTol, whereAmI);
    vec3 finalColor;

    bool notEllipse = false;
    if(1 - t <= .001){
        notEllipse = true;
        if(uAlpha <= 0.00001){
            discard;
        }
    }
    
    finalColor = mix(uDotColor.rgb,vColor,t);
    
    vec3 Normal;
    vec3 Light;
    vec3 Eye;
    if( uFlat ){
        Normal = normalize(vNf);
        Light = normalize(vLf);
        Eye = normalize(vEf);
    }else{
        Normal = normalize(vNs);
        Light = normalize(vLs);
        Eye = normalize(vEs);
    }
    vec3 ambient = uKa * finalColor;
    float d = max( dot(Normal,Light), 0. );
    vec3 diffuse = uKd * d * finalColor;
    float s = 0.;
    if( dot(Normal,Light) > 0. ){ // only do specular if the light can see the point
        vec3 ref = normalize( 2. * Normal * dot(Normal,Light) - Light );
        s = pow( max( dot(Eye,ref),0. ), uShininess );
    }
    vec3 specular = uKs * s * uSpecularColor.rgb;
    if(notEllipse){
        gl_FragColor = vec4( ambient.rgb + diffuse.rgb + specular.rgb, uAlpha );
    }else{
        gl_FragColor = vec4( ambient.rgb + diffuse.rgb + specular.rgb, 1. );
    }
  
}