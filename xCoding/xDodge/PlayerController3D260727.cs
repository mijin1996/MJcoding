using UnityEngine;
using UnityEngine.EventSystems;
using Controller;
using System.Collections.Generic;

[RequireComponent(typeof(Rigidbody))]
public class PlayerController3D : MonoBehaviour {

    private Rigidbody rb;
    private Animator ani;
    public FixedJoystick joy;

    private AudioSource audioSource;
    public AudioClip jumpSfx;
    public AudioClip dieSfx;
    public AudioClip punchSfx;
    public AudioClip kickSfx;
    public AudioClip[] runSfx;
    //public AudioClip[] dieSounds;

    public GameObject groundTouchFx; // CFXR Water Splash (Smaller), CFXR3 Magic Aura A (Runic)
    public GameObject screenTouchFx; // CFXR3 Hit Light B (Air) 가장좋아
    public GameObject punchFx; //누군가와 닿았을때 생기는 이펙트 || 일단 enemy없는 상태에서도 생기도록 함 📌
    public GameObject kickFx;  //누군가와 닿았을때 생기는 이팩트 || 일단 enemy없는 상태에서도 생기도록 함 📌

    public float walkSpeed = 5f;
    public float runSpeed = 15f;
    public float jumpForce = 7f;
    private int jumpCount = 0;
    public float AfterJumpfallSpeed = 2.5f;
    public float stopDistance = 0.1f;

    private bool runButton = false;
    private bool running = false;

    private bool grounded = true;
    public LayerMask groundLayer;

    private Vector3 move;
    private Vector3 targetPosition;
    private bool moveToTarget = false;

    public Transform attackPoint;
    //private Transform targetEnemy;

    void Awake() {
        CharacterMover oldMover = GetComponent<CharacterMover>();
        MovePlayerInput oldInput = GetComponent<MovePlayerInput>();
        CharacterController oldController = GetComponent<CharacterController>();

        if (oldMover != null) oldMover.enabled = false;
        if (oldInput != null) oldInput.enabled = false;
        if (oldController != null) oldController.enabled = false;
    }

    void Start() {
        rb = GetComponent<Rigidbody>();
        ani = GetComponent<Animator>();
        audioSource = GetComponent<AudioSource>();

        rb.isKinematic = false;
        rb.detectCollisions = true;
        rb.useGravity = true;
        rb.constraints = RigidbodyConstraints.FreezeRotationX | RigidbodyConstraints.FreezeRotationZ;

        CapsuleCollider capsule = GetComponent<CapsuleCollider>();
        if (capsule != null) capsule.isTrigger = false;
        if (ani != null) ani.applyRootMotion = false;
    }

    void Update() {
        PcInput();
        MobileInput();

        float keyboardH = Input.GetAxisRaw("Horizontal"); //
        float keyboardV = Input.GetAxisRaw("Vertical");
        float joystickH = joy != null ? joy.Horizontal : 0f;
        float joystickV = joy != null ? joy.Vertical : 0f;
        float finalH = keyboardH + joystickH;
        float finalV = keyboardV + joystickV;

        Vector3 input = new Vector3(finalH, 0, finalV);

        if (input.magnitude > 0.1f) {
            moveToTarget = false;
            move = input.normalized;
        } else if (moveToTarget) {
            move = targetPosition - transform.position;
            move.y = 0;

            if (move.magnitude <= stopDistance) {
                move = Vector3.zero;
                moveToTarget = false;
            } else {
                move.Normalize();
            }
        } else {
            move = Vector3.zero;
        }

        running = move != Vector3.zero && (Input.GetKey(KeyCode.LeftShift) || runButton);
        UpdateAnimation();

        if (Input.GetKeyDown(KeyCode.Space)) {
            Jump();
        }

        if (Input.GetKeyDown(KeyCode.Z)) Punch();
        if (Input.GetKeyDown(KeyCode.C)) Kick();
    }















    // 물리이동, 빠르 착지 처리 (점프 후 착지가 너무 느려서)
    void FixedUpdate() {
        if (rb.linearVelocity.y < 0) {
            rb.AddForce(Physics.gravity * (AfterJumpfallSpeed - 1f), ForceMode.Acceleration);
        }
        if (move == Vector3.zero) {
            return;
        }

        float moveSpeed = running ? runSpeed : walkSpeed;
        Quaternion rotation = Quaternion.LookRotation(move);

        rb.MoveRotation(Quaternion.RotateTowards(
            rb.rotation,
            rotation,
            180f * Time.fixedDeltaTime
        ));

        rb.MovePosition(
            rb.position + move * moveSpeed * Time.fixedDeltaTime
        );
    }

    // 이동·달리기·점프 애니메이션 값을 갱신
    void UpdateAnimation() {
        if (ani == null) {
            return;
        }

        bool moving = move != Vector3.zero;

        SetBool("Walk", moving && running == false);
        SetBool("Run", running);
        SetBool("Jump", grounded == false);
    }


    void SetBool(string name, bool value) {
        foreach (AnimatorControllerParameter parameter in ani.parameters) {
            if (parameter.name == name && parameter.type == AnimatorControllerParameterType.Bool) {
                ani.SetBool(name, value);
                return;
            }
        }
    }

    void SetTrigger(string name) {
        foreach (AnimatorControllerParameter parameter in ani.parameters) {
            if (parameter.name == name && parameter.type == AnimatorControllerParameterType.Trigger) {
                ani.SetTrigger(name);
                return;
            }
        }
    }

    // 바닥에 닿으면 점프 횟수를 초기화
    private void OnCollisionEnter(Collision collision) {
        if (collision.contactCount > 0 && collision.contacts[0].normal.y > 0.7f) {
            grounded = true;
            jumpCount = 0;
        }
    }

    // 바닥 또는 Bullet에 닿으면 사망 처리
    private void OnTriggerEnter(Collider other) {
        if (other.CompareTag("deathcube") || other.CompareTag("Bullet")) {
            Die();
        }
    }

    // 🖥️📱 이팩트 생성, 터치 위치를 바닥 목표 지점으로 설정
    void SetTargetAsGroundShowFx(Vector2 screenPosition) {
        if (Camera.main == null) return;
        Ray ray = Camera.main.ScreenPointToRay(screenPosition);
        if (Physics.Raycast(ray, out RaycastHit hit, 1000f, groundLayer) == false) return;
        targetPosition = hit.point;
        targetPosition.y = transform.position.y;
        moveToTarget = true;
        if (groundTouchFx != null) {
            GameObject fx = Instantiate(groundTouchFx, hit.point, Quaternion.identity);
            Destroy(fx, 2f);
        }
    }

    // 🖥️📱 이팩트 생성, 스크린으로 설정
    void ShowScreenFxPc(Vector2 screenPosition) {
        if (screenTouchFx == null || Camera.main == null) return;
        Ray ray = Camera.main.ScreenPointToRay(screenPosition);
        Vector3 fxPosition = ray.origin + ray.direction * 5f;
        GameObject fx = Instantiate(screenTouchFx, fxPosition, Quaternion.identity);
        Destroy(fx, 2f);
        Debug.Log(" ShowScreenFxPc screenFx: CFXR3 Hit Light B (Air) 가장좋아 ");
    }
    // 🖥️📱 이팩트 생성, 스크린으로 설정
    void ShowScreenFxMobile(Vector2 screenPosition) {
        if (screenTouchFx == null || Camera.main == null) return;
        Ray ray = Camera.main.ScreenPointToRay(screenPosition);
        Vector3 fxPosition = ray.origin + ray.direction * 1f;
        GameObject fx = Instantiate(screenTouchFx, fxPosition, Quaternion.identity);
        // 1:1비율 > 이펙트 생성이 너무 큼 > 사이즈 수정
        fx.transform.localScale = Vector3.one * 0.2f;
        Destroy(fx, 2f);
        Debug.Log(" ShowScreenFxMobile screenFx: CFXR3 Hit Light B (Air) 가장좋아 ");
    }

    void PcInput() {
        if (Input.touchCount > 0 || Input.GetMouseButtonDown(0) == false) return;
        ShowScreenFxPc(Input.mousePosition);
        if (EventSystem.current != null && EventSystem.current.IsPointerOverGameObject()) return;
        SetTargetAsGroundShowFx(Input.mousePosition);
        Debug.Log("PcFx: SetTargetAsGroundShowFx");
    }

    void MobileInput() {
        if (Input.touchCount == 0) return;
        Touch touch = Input.GetTouch(0); //손가락 터치가 GetTouch를의미
        Debug.Log("11 Mobile");
        if (touch.phase == TouchPhase.Began) {
            Debug.Log("22 Mobile");
            ShowScreenFxMobile(touch.position);
            if (IsUI(touch.position)) return; //ui, joy 눌러도 캐릭터가 이동하지 않게끔 IsUI 함수도 체크
            SetTargetAsGroundShowFx(touch.position);
            Debug.Log("33 Mobile");
        }
    }
    //Phase는 단계, 상태를 뜻함, 즉 손가락이 화면에 닿았는지 확인하는 코드

    //UI 위인지 확인해서, UI를 눌렀을 때 캐릭터 이동을 막는 코드
    bool IsUI(Vector2 pos) {
        if (EventSystem.current == null) return false;
        PointerEventData data = new PointerEventData(EventSystem.current);
        data.position = pos;
        List<RaycastResult> list = new List<RaycastResult>();
        EventSystem.current.RaycastAll(data, list);
        return list.Count > 0;
    }


    //-------------------------------------- 🖥️, 📱
    public void Jump() {
        if (jumpCount >= 3) {
            return;
        }

        jumpCount++;
        grounded = false;

        rb.linearVelocity = new Vector3(rb.linearVelocity.x, 0, rb.linearVelocity.z);
        rb.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);

        if (ani != null) {
            SetTrigger("Jump");
            Debug.Log("jump");

        }

        if (jumpSfx != null && audioSource != null) {
            audioSource.PlayOneShot(jumpSfx);
        }
    }



    public void OnRunButtonDown() {
        runButton = true;
        Debug.Log("runOn");
    }

    public void OnRunButtonUp() {
        runButton = false;
        Debug.Log("runOff");
    }

    public void Footstep() {
        int runStep = Random.Range(0, runSfx.Length);
        audioSource.PlayOneShot(runSfx[runStep]);
        Debug.Log("footStep");
    }

    public void Punch() {
        ani.SetTrigger("Punch");
        if (punchSfx != null && audioSource != null) audioSource.PlayOneShot(punchSfx);
        if (punchFx != null && attackPoint != null) Instantiate(punchFx, attackPoint.position, attackPoint.rotation);
        Debug.Log("punch");
    }

    public void Kick() {
        ani.SetTrigger("Kick");
        if (kickSfx != null && audioSource != null) audioSource.PlayOneShot(kickSfx);
        if (kickFx != null && attackPoint != null) Instantiate(kickFx, attackPoint.position, attackPoint.rotation);
        Debug.Log("kicking");
    }

    public void Die() {
        GameManager gameManager = FindFirstObjectByType<GameManager>();

        if (gameManager != null) {
            if (dieSfx != null) gameManager.PlaySound(dieSfx);
            gameManager.EndGame();
        }
        gameObject.SetActive(false);
        Debug.Log("gameOver...playerDie");
    }
}






/*
나중에 Enemy를 만들면:
Enemy 오브젝트 Tag를 Enemy로 설정
attackBullet에 공격 프리팹 연결
attackPoint를 손 또는 발 앞 위치에 연결
Punch() 안에서 Enemy를 찾고 공격 프리팹을 생성
지금 구조에는 먼저 Punch/Kick으로 가까운 Enemy를 때리는 방식을 붙이는 게 가장 간단해.
Assets/cs에 Enemy.cs 파일을 만들고 아래 코드 넣어.
using UnityEngine;

public class Enemy : MonoBehaviour{
    public int hp=3;

    public void Hit(int damage){
        hp-=damage;

        if(hp<=0){
            Destroy(gameObject);
        }
    }
}
Enemy 오브젝트에 설정Enemy 오브젝트에 Enemy.cs 추가
Collider 추가
Layer를 새로 만든 Enemy로 설정

PlayerController3D 변수 부분에 추가
public float attackRange=2f;
public int attackDamage=1;
기존의 이것은 유지해.
public LayerMask attackTargetLayer;
public Transform attackPoint;
PlayerController3D에 이 함수 추가
void Attack(){
    Vector3 point=attackPoint!=null?attackPoint.position:transform.position+Vector3.up;

    if(Physics.Raycast(point,transform.forward,out RaycastHit hit,attackRange,attackTargetLayer)){
        Enemy enemy=hit.collider.GetComponent<Enemy>();

        if(enemy!=null){
            enemy.Hit(attackDamage);
        }
    }
}
Punch()와 Kick()에 각각 Attack(); 한 줄 추가
public void Punch(){
    ani.SetTrigger("Punch");
    if(punchSound!=null&&audioSource!=null) audioSource.PlayOneShot(punchSound);
    if(punchEffect!=null&&attackPoint!=null) Instantiate(punchEffect,attackPoint.position,attackPoint.rotation);

    Attack();
}
public void Kick(){
    ani.SetTrigger("Kick");
    if(kickSound!=null&&audioSource!=null) audioSource.PlayOneShot(kickSound);
    if(kickEffect!=null&&attackPoint!=null) Instantiate(kickEffect,attackPoint.position,attackPoint.rotation);

    Attack();
}
마지막으로 PlayerRabbit Inspector의 Attack Target Layer에서 Enemy 레이어를 체크해.
그러면 펀치·킥할 때 캐릭터 앞 attackRange 거리 안의 Enemy 체력이 줄고, hp가 0이면 사라져.



*/
