using UnityEngine;

public class PlayerController : MonoBehaviour {
    private Rigidbody playerRigidbody;
    public DynamicJoystick joy;
    public GameObject effect;
    public Transform cam;

    private AudioSource audioSource;
    public AudioClip playerdiesound;


    private bool isGrounded = false;
    public bool thirdPersonMode;
    public bool isRunButtonPressed = false;
    public float speed = 15f;

    public AudioClip playerjumpSound;
    public float jumpForce = 7f;
    public int jumpcnt = 0;

    Animator ani;






    public void OnRunButtonDown() { isRunButtonPressed = true; }
    public void OnRunButtonUp() { isRunButtonPressed = false; }
    public void Die() {

        GameManager gameManager = FindFirstObjectByType<GameManager>();
        gameManager.PlaySound(playerdiesound);
        gameObject.SetActive(false);
        gameManager.EndGame();

    }

    private void OnTriggerEnter(Collider other) {
        if (other.tag == "deathcube") Die();
    }
    void Start() {
        // 카메라 모드 저장값을 읽어 3인칭 모드 여부 결정
        thirdPersonMode = PlayerPrefs.GetInt("CameraMode", 0) == 1;
        playerRigidbody = GetComponent<Rigidbody>();
        ani = GetComponent<Animator>();
        audioSource = GetComponent<AudioSource>();
        Debug.Log("thirdPersonMode = " + thirdPersonMode + ", cam = " + cam);

    }

    void Update() {
        float keyboardH = Input.GetAxisRaw("Horizontal");
        float keyboardV = Input.GetAxisRaw("Vertical");

        // 조이스틱과 키보드 입력을 합쳐 최종 이동 입력 생성
        float finalH = joy.Horizontal + keyboardH;
        float finalV = joy.Vertical + keyboardV;

        Vector3 move;

        // 3인칭 모드일 때 카메라 방향을 기준으로 이동 방향 계산
        // 플레이어 이동은 카메라 기준으로 계산되고, 카메라는 플레이어를 따라가는 구조
        if (thirdPersonMode && cam != null) {
            Vector3 camForward = cam.forward;
            Vector3 camRight = cam.right;

            camForward.y = 0;
            camRight.y = 0;

            camForward.Normalize();
            camRight.Normalize();

            move = camForward * finalV + camRight * finalH;
            if (move.magnitude > 1f) move.Normalize();
        } else {
            move = new Vector3(finalH, 0, finalV);
        }


        // 달리기 입력 시 속도 증가 및 효과 생성
        float runSpeed = speed;
        bool isShifting = Input.GetKey(KeyCode.LeftShift) || isRunButtonPressed;

        if (isShifting) {
            runSpeed = speed * 3.0f;
            // if (effect != null && move != Vector3.zero)
            // {
            //     Instantiate(effect, transform.position, Quaternion.identity);
            // }

        }

        // 이동 입력이 있으면 회전, 이동, 애니메이션 처리
        if (move != Vector3.zero) {
            Quaternion targetRotation = Quaternion.LookRotation(move);

            Vector3 input = new Vector3(finalH, 0, finalV);
            float inputMagnitude = Mathf.Clamp01(input.magnitude);

            float baseTurnSpeed = 180f;
            float turnSpeed = baseTurnSpeed * inputMagnitude;

            transform.rotation = Quaternion.RotateTowards(
                transform.rotation,
                targetRotation,
                turnSpeed * Time.deltaTime
            );

            transform.position += move.normalized * Time.deltaTime * runSpeed;

            ani.SetBool("Walk", true);
            ani.SetBool("Run", isShifting);
        } else {
            ani.SetBool("Walk", false);
            ani.SetBool("Run", false);
        }

        if (Input.GetKeyDown(KeyCode.Space)) {
            Jump();
        }
    }


    public void Jump() {
        if (jumpcnt < 2) {
            jumpcnt++;

            playerRigidbody.linearVelocity = new Vector3(
                playerRigidbody.linearVelocity.x,
                0f,
                playerRigidbody.linearVelocity.z
            );

            playerRigidbody.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);

            if (playerjumpSound != null && audioSource != null) {
                audioSource.PlayOneShot(playerjumpSound);
            }

            if (ani != null) {
                ani.SetTrigger("Jump");
            }
        }
    }


    private void OnCollisionEnter(Collision collision) {
        // 바닥 충돌 감지 시 점프 카운트 초기화
        if (collision.contacts[0].normal.y > 0.7f) {
            isGrounded = true;
            jumpcnt = 0;
        }
    }

    private void OnCollisionExit(Collision collision) {
        // 바닥에서 벗어나면 착지 상태 해제
        isGrounded = false;
    }

}
