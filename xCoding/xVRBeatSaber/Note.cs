using UnityEngine;

public class Note : MonoBehaviour {
    public AudioClip hitSound;
    public GameObject hitEffect;


    // Update is called once per frame
    void Update() {


        transform.position += Time.deltaTime * transform.forward * 2;   // 앞으로 가라는 의미


        // 큐브가 플레이어를 지나치면 미스 처리
        if (transform.position.z < -1f) {
            ComboManager.Instance.OnMiss();
            Destroy(gameObject);
        }

    }

    private void OnTriggerEnter(Collider other) {
        if (other.CompareTag("Saber") && other.gameObject.layer == gameObject.layer) {
            // 노트를 성공적으로 잘랐을 때 이 코드를 호출해야 합니다!
            ComboManager.Instance.AddCombo();

            // 💡 추가: 이펙트 프리팹이 등록되어 있다면 큐브 위치에 생성
            if (hitEffect != null) {
                // 큐브의 현재 위치(transform.position)와 회전값(Quaternion.identity)으로 생성합니다.
                GameObject effect = Instantiate(hitEffect, transform.position, Quaternion.identity);

                // 💡 중요: 생성된 이펙트가 메모리에 계속 남지 않도록 2초 뒤에 자동으로 삭제합니다.
                Destroy(effect, 2f);
            }


            if (hitSound != null) {
                AudioSource.PlayClipAtPoint(hitSound, transform.position);
            }
            Destroy(gameObject);
        }
    }
}
