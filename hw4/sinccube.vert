#version 330 compatibility


uniform float uA;
uniform float uK;



out vec3 vNs;
out vec3 vEs;
out vec3 vMC;


const float Y0 = 1.;

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
	vMC = gl_Vertex.xyz;

	vec4 newVertex = gl_Vertex;
	float r = length( newVertex.xy );
    newVertex.z = uA * Sinc( r, uK );

    vec4 ECposition = gl_ModelViewMatrix * newVertex;

	float dzdr = uA * DerivSinc( r, uK );
    float drdx = newVertex.x / r;
    float drdy = newVertex.y / r;
    float dzdx = dzdr * drdx;
    float dzdy = dzdr * drdy;

	vec3 Tx = vec3(1., 0., dzdx );
	vec3 Ty = vec3(0., 1., dzdy );

	vec3 newNormal = normalize(cross(Tx, Ty));

    vNs = newNormal;

	vEs = ECposition.xyz - vec3(0.,0.,0.);


	gl_Position = gl_ModelViewProjectionMatrix * newVertex;
	
}