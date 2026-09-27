using UnityEngine;

public class ThirdController : MonoBehaviour {
    // 플레이어 이동/점프에 필요한 컴포넌트
    private Rigidbody playerRigidbody;
    private Animator ani;
    private AudioSource audioSource;

    // 이동 속도와 점프 힘
    public float speed = 8f;
    public float jumpForce = 7f;

    // 모바일 조이스틱과 달리기 버튼 상태
    public DynamicJoystick joy;
    public bool isRunButtonPressed = false;

    // 사망/점프 사운드
    public AudioClip playerdiesound;
    public AudioClip playerjumpSound;

    // 3인칭 카메라 기준 이동에 사용할 카메라
    public Transform cam;

    // 점프 횟수, 착지 여부, 사망 여부
    private int jumpcnt = 0;
    private bool isGrounded = false;
    private bool isDead = false;

    public void OnRunButtonDown() {
        isRunButtonPressed = true;
    }

    public void OnRunButtonUp() {
        isRunButtonPressed = false;
    }

    public void Die() {
        if (isDead) return;
        isDead = true;

        GameManager gameManager = FindFirstObjectByType<GameManager>();

        if (gameManager != null) {
            gameManager.PlaySound(playerdiesound);
        }

        gameObject.SetActive(false);

        if (gameManager != null) {
            gameManager.EndGame();
        }
    }

    void Start() {
        // 필요한 컴포넌트 가져오기
        playerRigidbody = GetComponent<Rigidbody>();
        ani = GetComponent<Animator>();
        audioSource = GetComponent<AudioSource>();

        // 조이스틱이 Inspector에 연결되지 않았을 경우 자동으로 찾기
        if (joy == null) {
            joy = FindFirstObjectByType<DynamicJoystick>();
        }
    }

    void Update() {
        // 매 프레임 이동 처리
        MovePlayer();

        // 키보드 스페이스바 점프
        if (Input.GetKeyDown(KeyCode.Space)) {
            Jump();
        }
    }

    void MovePlayer() {
        // 조이스틱이 없으면 이동 처리 중단
        if (joy == null) return;

        // 키보드 입력과 조이스틱 입력을 합침
        float x = Input.GetAxis("Horizontal") + joy.Horizontal;
        float z = Input.GetAxis("Vertical") + joy.Vertical;

        // 아주 작은 입력값은 무시해서 제자리 걸음/미세 이동 방지
        Vector2 input = new Vector2(x, z);

        if (input.magnitude < 0.15f) {
            x = 0f;
            z = 0f;
        }

        Vector3 move;

        // 카메라가 연결되어 있으면 카메라 방향 기준으로 이동 방향 계산
        if (cam != null) {
            Vector3 camForward = cam.forward;
            Vector3 camRight = cam.right;

            // 위아래 방향 제거
            camForward.y = 0;
            camRight.y = 0;

            camForward.Normalize();
            camRight.Normalize();

            // 카메라 기준 이동 방향 계산
            // 현재는 방향이 반대로 보여서 전체 방향을 반전한 상태
            move = -(camForward * z + camRight * x);

            // 대각선 이동 속도가 너무 빨라지지 않도록 보정
            if (move.magnitude > 1f) {
                move.Normalize();
            }
        } else {
            // 카메라가 없을 때는 월드 기준 이동
            // 현재는 방향 반전을 적용한 상태
            move = new Vector3(-x, 0, -z);
        }

        float runSpeed = speed;

        // Shift 키, Run 버튼, 조이스틱 강한 입력이면 달리기 처리
        bool isShifting =
            Input.GetKey(KeyCode.LeftShift) ||
            isRunButtonPressed ||
            new Vector2(joy.Horizontal, joy.Vertical).magnitude > 0.9f;

        if (isShifting) {
            runSpeed = speed * 3.0f;
        }

        // 이동 입력이 있을 때만 이동/회전/애니메이션 실행
        if (move.magnitude > 0.01f) {
            // 이동 방향으로 캐릭터 회전
            transform.rotation = Quaternion.LookRotation(move);

            // Rigidbody 속도로 이동
            Vector3 velocity = move.normalized * runSpeed;
            velocity.y = playerRigidbody.linearVelocity.y;

            playerRigidbody.linearVelocity = velocity;

            // 걷기/달리기 애니메이션 켜기
            ani.SetBool("Walk", true);
            ani.SetBool("Run", isShifting);
        } else {
            // 입력이 없으면 수평 이동 정지
            playerRigidbody.linearVelocity = new Vector3(
                0,
                playerRigidbody.linearVelocity.y,
                0
            );

            // 걷기/달리기 애니메이션 끄기
            ani.SetBool("Walk", false);
            ani.SetBool("Run", false);
        }
    }

    private void OnTriggerEnter(Collider other) {
        // deathcube에 닿거나 Bullet에 맞으면 사망
        if (other.CompareTag("deathcube") || other.GetComponent<Bullet>() != null) {
            Die();
        }
    }

    public void Jump() {
        // 최대 2단 점프 허용
        if (jumpcnt < 2) {
            jumpcnt++;

            // 점프 전 수직 속도를 초기화해서 점프 힘을 일정하게 만듦
            playerRigidbody.linearVelocity = new Vector3(
                playerRigidbody.linearVelocity.x,
                0f,
                playerRigidbody.linearVelocity.z
            );

            // 위쪽으로 점프 힘 적용
            playerRigidbody.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);

            // 점프 사운드 재생
            if (playerjumpSound != null && audioSource != null) {
                audioSource.PlayOneShot(playerjumpSound);
            }

            // 점프 애니메이션 실행
            if (ani != null) {
                ani.SetTrigger("Jump");
            }
        }
    }

    private void OnCollisionEnter(Collision collision) {
        // 바닥에 닿으면 점프 횟수 초기화
        if (collision.contacts[0].normal.y > 0.7f) {
            isGrounded = true;
            jumpcnt = 0;
        }
    }
}
