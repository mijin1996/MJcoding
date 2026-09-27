using UnityEngine;
using UnityEngine.InputSystem;

public class PlayerController : MonoBehaviour {

    [Header("사망")]
    public AudioClip deathClip; 
    private bool isDead = false; 

    [Header("점프")]
    public float jumpForce = 700f;
    public GameObject PlayerJumpEffectPrefab; 
    private int jumpCount = 0; // 누적 점프 횟수
    private bool isGrounded = false; // 바닥에 닿았는지 나타냄

    [Header("컴포넌트")]
    private Rigidbody2D playerRigidbody; 
    private Animator animator; 
    private AudioSource playerAudio; 

    [Header("공격")]
    [SerializeField] private GameObject carrotPrefab;
    [SerializeField] private Transform carrotSpawnPoint;
    [SerializeField] private Transform attackTarget;

    private void Start() {
        playerRigidbody = GetComponent<Rigidbody2D>();
        animator = GetComponent<Animator>();
        playerAudio = GetComponent<AudioSource>();
    }

    private void Update() {
        if (isDead) {
            return;
        }

        if (Keyboard.current != null && Keyboard.current.aKey.wasPressedThisFrame) {
            //Input.GetKeyDown(KeyCode.A)){
            Debug.Log("A키 입력 감지");
            AttackByAKeyOrButton();
        }

        // 마우스 왼쪽 버튼을 눌렀으면 && 최대 점프 회수 (2)에 도달하지 않았다면
        if (Input.GetMouseButtonDown(0) && jumpCount < 5) {
            jumpCount++;
            playerRigidbody.linearVelocity = Vector2.zero; // 점프 직전에 속도를 순간적으로 제로(0, 0)로 변경
            playerRigidbody.AddForce(new Vector2(0, jumpForce)); // 위로 점프 힘을 가함
            // 오디오 소스 재생
            playerAudio.Play(); // playerAudio.PlayOneShot(jumpClip) 이 더 좋은 방법.
                                // 현재 방법은 다른 오디오가 플레이 되면 점프 사운드가 끊길 수 있음.
            if (PlayerJumpEffectPrefab != null) {
                Destroy(Instantiate(PlayerJumpEffectPrefab, transform.position, Quaternion.identity), 2f);
            }
        } else if (Input.GetMouseButtonUp(0) && playerRigidbody.linearVelocity.y > 0) {
            // 마우스 왼쪽 버튼에서 손을 뗐을 때 && 플레이어가 상승 중이라면
            // 상승 중인 경우 점프를 짧게 만들어주는 처리
            playerRigidbody.linearVelocity = playerRigidbody.linearVelocity * 0.5f;
        }
    }

    public void AttackByAKeyOrButton() {
        if (isDead) {
            return;
        }
        Debug.Log("A키 또는 공격 버튼으로 공격 실행");
        animator.SetTrigger("Attack");
        if (carrotPrefab == null || carrotSpawnPoint == null) {
            return;
        }
        GameObject carrot = Instantiate(carrotPrefab, carrotSpawnPoint.position, Quaternion.identity);
        CarrotProjectile projectile = carrot.GetComponent<CarrotProjectile>();
        if (projectile != null) {
            projectile.SetTarget(attackTarget);
        }
    }

    private void Die() {
        animator.SetTrigger("Die");
        playerAudio.clip = deathClip;
        playerAudio.Play();

        // 속도를 제로(0,0)로 변경
        playerRigidbody.linearVelocity = Vector2.zero;
        // 사망 상태로 true 로 변경
        isDead = true;
        GameManager.instance.OnPlayerDead();  //xx
    }

    private void OnTriggerEnter2D(Collider2D other) {
        // 트리거 콜라이더를 가진 장애물과의 충돌을 감지 |> 충돌한 상대방의 태그가 Dead이며 아직 사망하지 않았다면 Die() 실행
        if (other.tag == "Dead" && !isDead) {
            Die();
        }
    }

    private void OnCollisionEnter2D(Collision2D collision) {
        // 바닥에 닿았음을 감지하는 처리 |> 콜라이더와 닿았으며, 충돌 표면이 위쪽을 보고 있으면
        if (collision.contacts[0].normal.y > 0.7f) {
            // 바닥에 닿았음을 감지하는 처리
            isGrounded = true; // 바닥에 닿았으면 isGrounded를 true로 변경
            jumpCount = 0; // 점프 횟수 초기화
        }
    }

    private void OnCollisionExit2D(Collision2D collision) {
        // 바닥에서 벗어났음을 감지하는 처리
        // 어떤 콜라이더에서 떼어진 경우 isGrounded를 false로 변경
        isGrounded = false;
    }
}
