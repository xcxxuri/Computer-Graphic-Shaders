#version 330 compatibility

uniform float uK;
uniform float uP;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform sampler2D Noise2;
uniform float uStripes;
uniform float uSkinSmoothness;
uniform float uLightX, uLightY, uLightZ;
flat out vec3 vNf;
out vec3 vNs;
flat out vec3 vLf;
out vec3 vLs;
flat out vec3 vEf;
out vec3 vEs;
vec4 lightPosition = vec4(uLightX,uLightY,uLightZ, 1.);
out vec2 vST;

const float PI = 3.1415;

void
main( )
{
    vST = gl_MultiTexCoord0.st;

    vec4 nv = texture(Noise2,uNoiseFreq * vST);
    float n = nv.r + nv.g + nv.b + nv.a;    //  1. -> 3.
    n = n- 2.;                             //  0. -> 2.
                                   //0. -> 1.
    n*= uNoiseAmp;

	vec4 newPosition = gl_Vertex;
    if(int((vST.t + n) * uStripes) %2 == 0  ){
        float dist = abs(int((vST.t + n) *uStripes) +.5 - (vST.t + n) * uStripes);
       newPosition.xyz +=  (normalize( gl_NormalMatrix * gl_Normal ) * (.5-dist))/ uSkinSmoothness;
    }
	
	vec4 eyeLightPosition =  gl_ModelViewMatrix* lightPosition;

	vec4 ECposition = gl_ModelViewMatrix * newPosition;
	vNf = normalize( gl_NormalMatrix * gl_Normal ); // surface normal vector
	vNs = vNf;
	vLf = eyeLightPosition.xyz - ECposition.xyz; // vector from the point
	vLs = vLf; // to the light position
	vEf = vec3( 0., 0., 0. ) - ECposition.xyz; // vector from the point
	vEs = vEf ; // to the eye position

	gl_Position = gl_ModelViewProjectionMatrix * newPosition;
    
}