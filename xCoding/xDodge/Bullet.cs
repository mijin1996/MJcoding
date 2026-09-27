using UnityEngine;

public class Bullet : MonoBehaviour {
    private Rigidbody bulletRigidbody;
    public GameObject effect;
    public AudioClip hitSound;

    public float speed = 20f;


    void Start() {
        bulletRigidbody = GetComponent<Rigidbody>();
        // 총알을 현재 방향으로 속도 설정
        bulletRigidbody.linearVelocity = transform.forward * speed;

        // 10초 후 총알 자동 제거
        Destroy(gameObject, 10f);
    }

    private void OnTriggerEnter(Collider other) {
        // 플레이어 충돌 감지 및 처리
        if (other.tag == "Player") {
            // 충돌 위치에 효과 생성
            Instantiate(effect, other.transform.position, Quaternion.identity);
            AudioSource.PlayClipAtPoint(hitSound, transform.position);
            PlayerController playerController = other.GetComponent<PlayerController>();
            ThirdController thirdController = other.GetComponent<ThirdController>();

            // 플레이어 사망 처리
            if (playerController != null) {
                playerController.Die();
            }
            if (thirdController != null) {
                thirdController.Die();
            }
        }

        // 벽과 충돌하면 총알 제거
        if (other.tag == "Wall") {
            Destroy(gameObject);
        }

    }


}
