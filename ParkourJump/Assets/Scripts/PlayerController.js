﻿//Ajinkya - This is a modified version of standard asset PlatformInputController to make it work only in XY plane movement
//Updated to integrate player animations
//Updated in javascript can be easily converted to csharp if needed.

var autoRotate : boolean = true;
var maxRotationSpeed : float = 360;

private var motor : CharacterMotor;
private var anim : Animator;

function Awake () {
	motor = GetComponent(CharacterMotor);
	anim = GetComponent(Animator);
}

function Update () {
	// Get the input vector from keyboard or analog stick
	var directionVector = new Vector3(Input.GetAxis("Horizontal"), 0, 0);
	
	if (directionVector != Vector3.zero) {
		// Get the length of the directon vector and then normalize it
		// Dividing by the length is cheaper than normalizing when we already have the length anyway
		var directionLength = directionVector.magnitude;
		directionVector = directionVector / directionLength;
		
		// Make sure the length is no bigger than 1
		directionLength = Mathf.Min(1, directionLength);
		
		// Make the input vector more sensitive towards the extremes and less sensitive in the middle
		// This makes it easier to control slow speeds when using analog sticks
		directionLength = directionLength * directionLength;
		
		// Multiply the normalized direction vector by the modified length
		directionVector = directionVector * directionLength;
	}
	
	// Rotate the input vector into camera space so up is camera's up and right is camera's right
	directionVector = Camera.main.transform.rotation * directionVector;
	
	// Rotate input vector to be perpendicular to character's up vector
	var camToCharacterSpace = Quaternion.FromToRotation(-Camera.main.transform.forward, transform.up);
	directionVector = (camToCharacterSpace * directionVector);
	
	// Apply the direction to the CharacterMotor
	motor.inputMoveDirection = directionVector;
	motor.inputJump = Input.GetButton("Jump");
	
	anim.SetBool("Jump", Input.GetButton("Jump"));
	anim.SetFloat("Speed", Mathf.Abs(directionVector.x));
	
	// Set rotation to the move direction	
	if (autoRotate && directionVector.sqrMagnitude > 0.01) {
		var newForward : Vector3 = ConstantSlerp(
			transform.forward,
			directionVector,
			maxRotationSpeed * Time.deltaTime
		);
		newForward = ProjectOntoPlane(newForward, transform.up);
		transform.rotation = Quaternion.LookRotation(newForward, transform.up);
	}
}

function ProjectOntoPlane (v : Vector3, normal : Vector3) {
	return v - Vector3.Project(v, normal);
}

function ConstantSlerp (from : Vector3, to : Vector3, angle : float) {
	var value : float = Mathf.Min(1, angle / Vector3.Angle(from, to));
	return Vector3.Slerp(from, to, value);
}

// Require a character controller to be attached to the same game object
@script RequireComponent (CharacterMotor)
