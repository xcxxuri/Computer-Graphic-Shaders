#version 330 compatibility
in vec2 vST;
uniform sampler2D uImageUnit;
uniform float uLeftRight;
uniform float uUpDown;
uniform float uWidth;
uniform float uHeight;
uniform bool uCircle;
uniform bool uTaper;
uniform float uRadius;
uniform float Timer;
uniform sampler2D Noise2;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform float uDs;
const float PI = 3.1415926;

bool inCircle(){
    if(sqrt(pow((vST.s-uLeftRight),2) + pow((vST.t-uUpDown),2))  <= uRadius){
        return true;
    }
    return false;
}
bool inRectangle(){
    float s = vST.s;
    float t = vST.t;
    if( s <= uLeftRight + uWidth && s >= uLeftRight - uWidth && t <= uUpDown + uHeight && t >= uUpDown - uHeight){
        return true;
    }
    return false;
}

float getCircleTaper(){
    float ConicalBusBar = sqrt(pow((vST.s-uLeftRight),2) + pow((vST.t-uUpDown),2));
    float mTaper = smoothstep(uRadius*2,uRadius,ConicalBusBar);
    return mTaper;
}

float getRectTaper(){
    float minS = uLeftRight - uWidth;
    float maxS = uLeftRight + uWidth;
    float minT = uUpDown - uHeight;
    float maxT = uUpDown + uHeight;

    float ds = max ((max(minS - vST.s,0.)),(vST.s - maxS));
    float dt = max ((max(minT - vST.t,0.)),(vST.t - maxT));
    float d = sqrt(ds*ds + dt*dt);
    float mTaper = smoothstep(.1,0,d);
    return mTaper;
}

void
main( )
{
    float mTaper = 0.;
    vec3 newColor;
    bool len = false;

    if(uCircle){
        if(inCircle()){
            len = true;
            mTaper = 1.;
        }else{
            mTaper = getCircleTaper();
        }
    }else{
        if(inRectangle()){
            len = true;
            mTaper = 1.;
        }else{
            mTaper = getRectTaper();
        }
    }

    if(uTaper || len){
        vec4 nv = texture( Noise2, uNoiseFreq * vST );
        float n = nv.r + nv.g + nv.b + nv.a; // range from 1. -> 3.
        n -= 2;
        n *= uNoiseAmp;
       
        float newS, newT;
        newS = vST.s + mTaper * n * cos(2 * PI * Timer * uDs);
        newT = vST.t + mTaper * n * sin(2 * PI * Timer * uDs);
        vec2 newVST = vec2( newS, newT);

        newColor = texture( uImageUnit, newVST ).rgb;
        gl_FragColor = vec4( newColor, 1. );
    }else{
        newColor = texture( uImageUnit, vST ).rgb;
        gl_FragColor = vec4( newColor, 1. );
    }

}