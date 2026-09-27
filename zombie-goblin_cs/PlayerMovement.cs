using UnityEngine;

public class PlayerMovement : MonoBehaviour {
    public float moveSpeed = 5f;
    public float rotateSpeed = 180f;
    private PlayerInput playerInput;
    private Rigidbody playerRb;
    private Animator playerAni;

    private void Start() {
        playerInput = GetComponent<PlayerInput>();
        playerRb = GetComponent<Rigidbody>();
        playerAni = GetComponent<Animator>();
    }

    private void FixedUpdate() {
        Rotate();
        Move();
        playerAni.SetFloat("Move", playerInput.move);
    }
    // ↕️ : 상대적으로 이동할 거리 계산; rb를 이용해 게임 오브젝 위치 변경;
    private void Move() {
        Vector3 moveDistance = playerInput.move * transform.forward * moveSpeed * Time.deltaTime;
        playerRb.MovePosition(playerRb.position + moveDistance);
    }
    // ↔️ : 상대적으로 회전할 수치 계산; rb를 이용해 게임 오브젝 회전 변경;
    private void Rotate() {
        float turn = playerInput.rotate * rotateSpeed * Time.deltaTime;
        playerRb.rotation = playerRb.rotation * Quaternion.Euler(0, turn, 0f);
    }
}
