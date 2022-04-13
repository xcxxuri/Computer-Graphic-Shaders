#version 330 compatibility

in vec2 vST;
in vec3 vMCposition;

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
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform sampler2D Noise2;
uniform float uStripes;

const vec3 blackColor = vec3(0.,0.,0.);
const vec3 orangeColor = vec3(250./255.,100./255.,30./255.);
const vec3 mudColor = vec3(150./255.,80./255.,0.);
const vec3 whiteColor = vec3(1.,1.,1.);
uniform float WhiteStrips = .1;
uniform float WhiteBlend = .3;
uniform float OrangeStrips = .45;
uniform float OrangeBlend = .65;
uniform float StripMix = .4;

void main( ){
    vec4 nv = texture(Noise2,uNoiseFreq * vST);
    float n = nv.r + nv.g + nv.b + nv.a;    //  1. -> 3.
    n = n - 2.;                             //  -1. -> 1.                           //0. -> 1.
    n*= uNoiseAmp;

    vec3 finalColor;

    float dist = abs(int((vST.t + n) *uStripes) +.5 - (vST.t + n) * uStripes);
    if(int((vST.t + n) * uStripes) %2 == 0  ){
        //distance from the center, goes between 0. -> .5
        dist*=2.;
        if(dist <= WhiteStrips){
            finalColor = whiteColor;
        }else if(dist > WhiteStrips && dist <= WhiteBlend){
            float t = smoothstep(WhiteStrips,WhiteBlend,dist);
            finalColor = mix(whiteColor,mudColor,t);
        }else if(dist > WhiteBlend && dist <= OrangeStrips){
            finalColor = mudColor;
        }else if(dist > OrangeStrips && dist <= OrangeBlend){
            float t = smoothstep(OrangeStrips,OrangeBlend,dist);
            finalColor = mix(mudColor,orangeColor,t);
        }else{
            finalColor = orangeColor;
        }
    }else{
        //dist is the distance from the cetner of the stripe
        dist*=2.;
        if(dist > StripMix){
            float t = smoothstep(StripMix,1.,dist);
            finalColor = mix(blackColor,orangeColor,t);
        }
        else{
            finalColor = blackColor;
        }
    }
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
 
    gl_FragColor = vec4( ambient.rgb + diffuse.rgb + specular.rgb, 1. );

  
}