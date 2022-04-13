#version 330 compatibility

flat out vec3 vNf;
out vec3 vNs;
flat out vec3 vLf;
out vec3 vLs;
flat out vec3 vEf;
out vec3 vEs;

uniform float uLightX, uLightY, uLightZ;

uniform vec4 uObjectColor;
vec4 lightPosition = vec4(uLightX,uLightY,uLightZ, 1.);
out vec2 vST;
out vec3 vColor;
void
main( )
{ 

	vec4 eyeLightPosition = gl_ModelViewMatrix * lightPosition;
	vST = gl_MultiTexCoord0.st;

	vColor = uObjectColor.rgb;
	vec4 ECposition = gl_ModelViewMatrix * gl_Vertex;
	vNf = normalize( gl_NormalMatrix * gl_Normal ); // surface normal vector
	vNs = vNf;
	vLf = eyeLightPosition.xyz - ECposition.xyz; // vector from the point
	vLs = vLf; // to the light position
	vEf = vec3( 0., 0., 0. ) - ECposition.xyz; // vector from the point
	vEs = vEf ; // to the eye position
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}