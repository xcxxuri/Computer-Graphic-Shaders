#version 330 compatibility

uniform sampler2D uTexUnit;

in vec2 vST;

void
main( )
{
    vec3 newColor = texture(uTexUnit,vST).rgb;
    gl_FragColor = vec4(newColor, 1. );
}