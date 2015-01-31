using UnityEngine;
using System.Collections;

public class PlayerController : MonoBehaviour
{
	public float turnSmoothing = 15f;
	public float speedDampTime = 0.1f;
	private Animator anim;
	private float speed = 1f;

    float jumpForce;

	void Awake ()
	{
		anim = GetComponent<Animator>();
        jumpForce = 1f;
	}

    void Update()
    {
        //Keyboard and xbox controller controls.
        if (Input.GetButtonDown("Jump"))
        {
            anim.SetBool("Jump", true);
        }
        else if (Input.GetButtonUp("Jump"))
        {
            anim.SetBool("Jump", false);
        }
    }

	void FixedUpdate ()
	{
        //DON'T get button inputs in Fixed Updates
        //You will lose some input if you do for
        //very complicated reasons

        float h = Input.GetAxis("Horizontal");
		
		
		//float v = Input.GetAxis ("Vertical");

		//float x = h * Time.deltaTime;// * speed;
		//float y = v * Time.deltaTime * speed;

        ////transform.Translate(0, 0 , x);

		if (h != 0f) {
			Rotate (h);
		}

		anim.SetFloat("Speed", Mathf.Abs(h));
	}

	void Rotate (float horizontal)
	{
		Vector3 targetDirection = new Vector3(horizontal, 0f, 0f);
		Quaternion targetRotation = Quaternion.LookRotation(targetDirection, Vector3.up);
		Quaternion newRotation = Quaternion.Lerp(rigidbody.rotation, targetRotation, turnSmoothing * Time.deltaTime);
		rigidbody.MoveRotation(newRotation);
	}	
}