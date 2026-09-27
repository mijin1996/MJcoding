using UnityEngine;

public class Fixed : MonoBehaviour {
    public DynamicJoystick joystick;
    public float moveSpeed = 8f;
    public float turnSpeed = 180f;
    public float jumpForce = 5f;

    private Rigidbody rb;
    private Animator animator;
    private bool isGrounded = true;

    void Start() {
        rb = GetComponent<Rigidbody>();
        animator = GetComponent<Animator>();
    }

    void Update() {
        float horizontal = joystick.Horizontal;
        float vertical = joystick.Vertical;

        // 좌우 입력은 캐릭터 회전
        transform.Rotate(0f, horizontal * turnSpeed * Time.deltaTime, 0f);

        // 위아래 입력은 캐릭터가 바라보는 방향으로 이동
        Vector3 move = transform.forward * vertical;
        transform.position += move * moveSpeed * Time.deltaTime;

        // 애니메이션
        if (animator != null) {
            bool isMoving = Mathf.Abs(vertical) > 0.1f;
            animator.SetBool("Walk", isMoving && isGrounded);
        }
    }

    public void Jump() {
        if (!isGrounded)
            return;

        isGrounded = false;

        if (rb != null) {
            rb.linearVelocity = new Vector3(rb.linearVelocity.x, 0f, rb.linearVelocity.z);
            rb.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);
        }

        if (animator != null) {
            animator.SetBool("Walk", false);
            animator.SetBool("Run", false);
            animator.SetTrigger("Jump");
        }
    }

    private void OnCollisionEnter(Collision collision) {
        if (collision.contacts[0].normal.y > 0.7f) {
            isGrounded = true;
        }
    }
}
