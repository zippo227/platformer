using UnityEngine;
using System.Collections;

public class CameraFollow : MonoBehaviour {
	public Transform target;
	public float lerpSpeed = 3f;
	public float xScreenOffset = 2f;
	public float yScreenOffset = 2f;

	private Vector3 velocity = new Vector3 (.5f, .5f, .5f);

	void LateUpdate () {

		float smoothX = Mathf.SmoothDamp (transform.position.x, target.position.x+xScreenOffset, ref velocity.x, .3f);
		float smoothY = Mathf.SmoothDamp (transform.position.y, target.position.y+yScreenOffset, ref velocity.y, .3f);

		transform.position = Vector3.Lerp (transform.position, new Vector3(smoothX, smoothY, transform.position.z), Time.deltaTime * lerpSpeed);

	}
}
