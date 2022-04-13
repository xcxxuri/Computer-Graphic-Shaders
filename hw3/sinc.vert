#version 330 compatibility

uniform float uA;
uniform float uK;
//uniform float uP;

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


out vec3 vMC;

const float PI = 3.14159265;

float
Sinc( float r, float k )
{
	if( r == 0. )
		return 1.;
	return sin(r*k) / (r*k);
}

float
DerivSinc( float r, float k )
{
	if( r == 0. )
		return 0;
	return ( r*k*cos(r*k) - sin(r*k) ) / ( r*k*r*k );
}

void
main( )
{

    //pleats here
    vec4 newVertex = gl_Vertex;
    float r = length( newVertex.xy );
    newVertex.z = uA * Sinc( r, uK );

	float dzdr = uA * DerivSinc( r, uK );
    float drdx = newVertex.x / r;
    float drdy = newVertex.y / r;
    float dzdx = dzdr * drdx;
    float dzdy = dzdr * drdy;

	vec3 Tx = vec3(1., 0., dzdx );
	vec3 Ty = vec3(0., 1., dzdy );

	vec3 newNormal = normalize(cross(Tx, Ty));
	vec4 eyeLightPosition =  gl_ModelViewMatrix* lightPosition;
	vST = gl_MultiTexCoord0.st;
	vColor = uObjectColor.rgb;

	vec4 ECposition = gl_ModelViewMatrix * newVertex;


	vNf = normalize( gl_NormalMatrix * newNormal ); // surface normal vector
	vNs = vNf;
	vLf = eyeLightPosition.xyz - ECposition.xyz; // vector from the point
	vLs = vLf; // to the light position
	vEf = vec3( 0., 0., 0. ) - ECposition.xyz; // vector from the point
	vEs = vEf ; // to the eye position

	gl_Position = gl_ModelViewProjectionMatrix * newVertex;


	vMC = gl_Position.xyz;
}